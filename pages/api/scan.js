import { applyRateLimit } from '../../middlewares';
import { zaproxy, createTranslatedAlert, getTranslatedAlertByAlertRef, translate } from '../../services';

export default async function handler(req, res) {
  try {
    await applyRateLimit(req, res)
  } catch {
    return response.status(429).send('Too many requests')
  }
  //começa escanear url
  // const response = await zaproxy.spider.scan(req.query.url);
  // vê o status do escaneamento 0-100
  // const response = await zaproxy.spider.status(req.query.url);
  // para o escaneamento
  // const response = await zaproxy.spider.stop(req.query.url);
  // pega os alertas do escaneamento
  const { alerts } = await zaproxy.core.alerts(req.query.url);
  for (let i = 0; i < alerts.length; i++) {
    let translatedAlert = await getTranslatedAlertByAlertRef(alerts[i].alertRef);
    if (!translatedAlert) {
      translatedAlert = {
        alertRef: alerts[i].alertRef,
        alert: await translate(alerts[i].alert),
        description: await translate(alerts[i].description),
        solution: await translate(alerts[i].solution),
      }
      createTranslatedAlert(translatedAlert);
    }
    alerts[i].alert = translatedAlert.alert;
    alerts[i].description = translatedAlert.description;
    alerts[i].solution = translatedAlert.solution;
  }
  //pegar os alertas por tipo de vulnerabilidade
  // const response = await zaproxy.reqPromise(`http://zap/JSON/alert/view/alertsByRisk?url=${req.query.url}`);
  res.status(200).json({ alerts })
}