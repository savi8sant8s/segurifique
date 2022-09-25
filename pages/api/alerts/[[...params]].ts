import { Body, createHandler, Get, Post, Query } from 'next-api-decorators'
import {
  urlAlerts,
  createTranslatedAlert,
  getTranslatedAlertByAlertRef,
  translate,
  urlAlertsSummary,
} from '../../../services'

class AlertsHandler {
  @Get()
  async urlAlerts(@Query('url') url: string) {
    const { alerts } = await urlAlerts(url)
    for (let i = 0; i < alerts.length; i++) {
      let translatedAlert: any = await getTranslatedAlertByAlertRef(
        alerts[i].alertRef
      )
      if (!translatedAlert) {
        translatedAlert = {
          alertRef: alerts[i].alertRef,
          alert: await translate(alerts[i].alert),
          name: await translate(alerts[i].name),
          description: await translate(alerts[i].description),
          solution: await translate(alerts[i].solution),
        }
        await createTranslatedAlert(translatedAlert)
      }
      alerts[i].alert = translatedAlert.alert
      alerts[i].name = translatedAlert.name
      alerts[i].description = translatedAlert.description
      alerts[i].solution = translatedAlert.solution
    }
    return alerts
  }

  @Get('/summary')
  async urlAlertsSummary(@Query('url') url: string) {
    const { alertsSummary } = await urlAlertsSummary(url)
    return alertsSummary
  }

  // Usado para traduzir e salvar alertas extraídos do site do ZAP no banco de dados 
  // @Post('/translate')
  // async translate(@Body() body: any) {
  //   for (let i = 0; i < body.length; i++) {
  //     if (body[i].summary && body[i].solution){
  //       body[i].title = await translate(body[i].title)
  //       body[i].summary = await translate(body[i].summary)
  //       body[i].solution = await translate(body[i].solution)
  //       await createTranslatedAlert(body[i])
  //     }
  //   }
  // }
}

export default createHandler(AlertsHandler)
