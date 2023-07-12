import React from 'react'
import { useState } from 'react'
import { useStore } from 'effector-react'
import { widgetModel } from './WidgetModel'
import removeIcon from './assets/icons/icon-remove.svg'
import { IWidget, IWeatherWidget } from './WidgetModel/models/types'
import './App.scss'

const columnIds = [1, 2, 3]

const App: React.FC = () => {
  const { widgetEvents, widgetStores, widgetEffects } = widgetModel

  const widgets = useStore(widgetStores.$widgets)
  const [currentWidget, setCurrentWidget] = useState<IWidget>()

  const createNewWidgetHandler = () => {
    widgetEvents.widgetAdd()
  }

  const onDragOverEventHandler = (ev: DragAndDropEvent<HTMLDivElement>) => {
    ev.preventDefault()
  }

  const onDragStartEventHandler = (widget: IWidget) => () => {
    setCurrentWidget(widget)
  }
  const onDragEndEventHandler = (ev: DragAndDropEvent<HTMLDivElement>) => {
    const { target } = ev

    target.style.boxShadow = 'none'
  }

  const onDeskDropEventHandler =
    (column: number) => (ev: DragAndDropEvent<HTMLDivElement>) => {
      ev.preventDefault()
      widgetEvents.widgetChangeDesk({
        id: currentWidget.id,
        newColumnId: column
      })
    }

  const onSelectChangeHandler =
    (widget: IWeatherWidget) => (ev: React.ChangeEvent<HTMLSelectElement>) => {
      void widgetEffects.updateSettingsFx({
        cityId: ev.target.value,
        widgetId: widget.id
      })
    }

  return (
    <div className='desk-page'>
      <div className='desk'>
        {columnIds.map((column) => (
          <div
            key={column}
            className='column-card'
            onDrop={onDeskDropEventHandler(column)}
            onDragOver={onDragOverEventHandler}
          >
            <span className='title'>Колонка №{column}</span>
            <div className='column-card__widgets'>
              {widgets.map(
                (widget) =>
                  widget.columnId === column && (
                    <div
                      draggable={true}
                      onDragOver={onDragOverEventHandler}
                      onDragStart={onDragStartEventHandler(widget)}
                      onDragEnd={onDragEndEventHandler}
                      key={widget.id}
                      className='widget'
                    >
                      <select
                        value={widget.setting.id}
                        className='widget__select'
                        onChange={onSelectChangeHandler(widget)}
                        name='city'
                        id='city-select'
                      >
                        {widget.selects.map((option) => (
                          <option key={option.key} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => widget.remove()}
                        className='widget__remove'
                      >
                        <img src={removeIcon} alt='Удалить' />
                      </button>
                      {widget.info && (
                        <>
                          <span className='widget__forecast--title'>
                            {widget.info?.weatherInfo}
                          </span>
                          <div className='widget__forecast--temperature'>
                            <img src={widget.info?.icon} alt='Иконка погоды' />
                            <span>{widget.info?.temperature}</span>
                          </div>
                        </>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>
        ))}
      </div>

      <button onClick={createNewWidgetHandler} className='widget-button'>
        Добавить виджет
      </button>
    </div>
  )
}

export default App
