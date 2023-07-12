import axios from 'axios'
import {
  IWeatherResponse,
  IWeatherWidget,
  IWidget,
  TWeatherWidgetCity,
  TWheatherSetting
} from './types'
import { widgetEvents } from './widgetStore'

class Widget implements IWidget {
  readonly id: number
  public columnId: number

  constructor(newId?: number) {
    this.id = newId
    this.columnId = 1
  }

  newColumnId(columnId: number) {
    this.columnId = columnId
  }

  remove(): void {
    widgetEvents.widgetRemove(this.id)
  }
}

class WeatherWidget extends Widget implements IWeatherWidget {
  public setting: {
    id: string
  }
  public info: { temperature: string; weatherInfo: string; icon: string }
  public selects: { id: string; label: string; key: TWeatherWidgetCity }[]

  constructor(newId: number) {
    super(newId)
    this.setting = { id: '1397263' }
    this.selects = [
      { id: '1397263', label: 'Москва', key: 'msk' },
      { id: '2427269', label: 'Уфа', key: 'ufa' },
      { id: '293708', label: 'Красноярск', key: 'krsk' }
    ]
  }

  async setSettings(settings: TWheatherSetting) {
    this.setting = settings
    await this.getData()
  }

  async getData(): Promise<void> {
    const res: { data: IWeatherResponse[] } = await axios.get(
      `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${this.setting.id}?apikey=9vIj4kFdlAe9eeGqm8evc3ZA7mYLu4mE&language=ru-ru&details=true&metric=true`
    )
    const forecast = res.data[0]
    this.info = {
      weatherInfo: forecast.IconPhrase,
      icon: `https://developer.accuweather.com/sites/default/files/${
        forecast.WeatherIcon < 10
          ? `0${forecast.WeatherIcon}`
          : forecast.WeatherIcon
      }-s.png`,
      temperature: `${forecast.Temperature.Value} C`
    }

    return new Promise((resolve) => {
      resolve()
    })
  }
}

export const widgetClasses = {
  Widget,
  WeatherWidget
}
