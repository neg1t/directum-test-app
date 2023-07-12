export type TWeatherWidgetCity = 'krsk' | 'msk' | 'ufa'

export type TWheatherSetting = {
  id: string
}

export interface IWidget {
  id: number
  columnId: number
  newColumnId(columnId: number): void
  remove(): void
  getData?(): Promise<void>
}

export interface IWeatherWidget extends IWidget {
  setting?: TWheatherSetting
  setSettings?(setting: TWheatherSetting): Promise<void>
  selects: { id: string; label: string; key: TWeatherWidgetCity }[]
  info: {
    temperature: string
    icon: string
    weatherInfo: string
  }
}

//? request

export interface IWeatherResponse {
  Temperature: {
    Value: number
  }
  WeatherIcon: number
  IconPhrase: string
}
