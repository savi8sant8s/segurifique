import axios from 'axios'

const baseURL = process.env.ZAP_API_URL

const axios_ = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  params: {
    apikey: process.env.ZAP_API_KEY,
  },
})

export async function spiderScan(url: string) {
  const response = await axios_.get(`/JSON/spider/action/scan`, {
    params: {
      url,
      recurse: true,
      subtreeOnly: true,
      maxChildren: 1,
    },
  })
  return response.data
}

export async function spiderStatus(scanId: string) {
  const response = await axios_.get(`/JSON/spider/view/status`, {
    params: {
      scanId,
    },
  })
  return response.data
}

export async function urlAlerts(baseurl: string) {
  const response = await axios_.get(`/JSON/alert/view/alerts`, {
    params: {
      baseurl,
    },
  })
  return response.data
}

export async function urlAlertsSummary(baseurl: string) {
  const response = await axios_.get(`/JSON/alert/view/alertsSummary`, {
    params: {
      baseurl,
    },
  })
  return response.data
}

export async function urlsAlreadyScanned() {
  const response = await axios_.get(`/JSON/core/view/sites`)
  return response.data
}
