import { useRef, useState } from 'react'
import styles from '../styles/Home.module.scss'
import axios from 'axios'

export default function Home() {
  const [url, setUrl] = useState('')
  const [scanId, setScanId] = useState('')
  const [progress, setProgress] = useState('')
  const [summary, setSummary] = useState<any>({})
  const [alerts, setAlerts] = useState<any>([])
  const intervalRef = useRef<number | null>(null)

  const startScan = async () => {
    axios.get(`/api/scan?url=${url}`).then((res) => {
      setScanId(res.data.scan)
      intervalRef.current = window.setInterval(async () => {
        await scanStatus(res.data.scan)
      }, 1000)
    })
  }

  const stopScan = async () => {
    axios.put(`/api/scan/stop/${scanId}`).then(() => {
      setScanId('')
      setProgress('')
      setSummary(null)
      setUrl('')
    })
  }

  const scanStatus = async (scanId: string) => {
    axios.get(`/api/scan/status/${scanId}`).then(async (res) => {
      setProgress(res.data.status)
      if (res.data.status === '100' && intervalRef.current) {
        window.clearInterval(intervalRef.current)
        await getAlertsSummary(url)
        await getAlerts(url)
      }
    })
  }

  const getAlertsSummary = async (url: string) => {
    axios.get(`/api/alerts/summary?url=${url}`).then((res) => {
      setSummary(res.data)
    })
  }

  const getAlerts = async (url: string) => {
    axios.get(`/api/alerts?url=${url}`).then((res) => {
      setAlerts(res.data)
    })
  }

  const OptionButton = () => {
    if (!!scanId) {
      return <button onClick={stopScan}>Parar escaneamento</button>
    }
    return <button onClick={startScan}>Iniciar escaneamento</button>
  }

  return (
    <div className={styles.container}>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <OptionButton />
      {scanId && (
        <div>
          <p>Scan ID: {scanId}</p>
          <p>Status: {progress}</p>
        </div>
      )}
      {progress === '100' && (
        <>
          <div>
            <p>Resumo de vulnerabilidades:</p>
            <ul>
              <li>Alta: {summary?.High}</li>
              <li>Média: {summary?.Medium}</li>
              <li>Baixa: {summary?.Low}</li>
              <li>Informacional: {summary?.Informational}</li>
            </ul>
          </div>
          <div>
            <p>Vulnerabilidades</p>
            <ul>
              {alerts.map((alert: any) => (
                <li key={alert.id}>{alert.name}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}
