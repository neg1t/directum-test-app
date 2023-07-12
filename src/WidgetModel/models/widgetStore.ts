import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample
} from 'effector'
import { IWeatherWidget } from './types'
import { widgetClasses } from './Widget'

const { WeatherWidget } = widgetClasses

//? effects

const updateWidgetsFx = createEffect<
  { widgets: IWeatherWidget[]; id: number },
  IWeatherWidget[]
>(async ({ widgets, id }) => {
  const updateWidgets = [...widgets]
  const idx = updateWidgets.findIndex((item) => item.id === id)
  if (idx !== -1) {
    await updateWidgets[idx].getData()
  }
  return updateWidgets
})

const updateWidgetsSettingsFx = createEffect<
  { widgets: IWeatherWidget[]; cityId: string; widgetId: number },
  IWeatherWidget[]
>(async ({ widgets, cityId, widgetId }) => {
  const updateWidgets = [...widgets]
  const idx = updateWidgets.findIndex((item) => item.id === widgetId)
  if (idx !== -1) {
    await updateWidgets[idx].setSettings({ id: cityId })
  }
  return updateWidgets
})

//? events

const widgetRemove = createEvent<number>()
const widgetAdd = createEvent()
const widgetChangeDesk = createEvent<{ id: number; newColumnId: number }>()

//? effects

const $widgets = createStore<IWeatherWidget[]>([])
  .on(widgetRemove, (state, payload) =>
    state.filter((item) => item.id !== payload)
  )
  .on(updateWidgetsFx.doneData, (_, payload) => payload)
  .on(updateWidgetsSettingsFx.doneData, (_, payload) => payload)
  .on(widgetAdd, (state) => [
    ...state,
    new WeatherWidget(
      (Math.max.apply(
        null,
        state.length ? state.map((item) => item.id) : [0]
      ) as number) + 1
    )
  ])
  .on(widgetChangeDesk, (state, payload) =>
    state.flatMap((item) =>
      item.id === payload.id
        ? Object.assign(new WeatherWidget(item.id), item, {
            columnId: payload.newColumnId
          })
        : item
    )
  )

//? others

const updateWidgetDataFx = attach({
  effect: updateWidgetsFx,
  source: $widgets,
  mapParams: (id: number, widgets) => ({ id, widgets })
})

const updateSettingsFx = attach({
  effect: updateWidgetsSettingsFx,
  source: $widgets,
  mapParams: (
    { cityId, widgetId }: { cityId: string; widgetId: number },
    widgets
  ) => ({
    cityId,
    widgetId,
    widgets
  })
})

// при добавлении виджета запрашиваем данные по нему
sample({
  clock: widgetAdd,
  source: $widgets,
  fn: (widgets) => {
    return widgets[widgets.length - 1].id
  },
  target: updateWidgetDataFx
})

export const widgetEffects = {
  updateWidgetDataFx,
  updateSettingsFx
}

export const widgetEvents = {
  widgetRemove,
  widgetAdd,
  widgetChangeDesk
}

export const widgetStores = {
  $widgets
}
