import { useRef, useState, useEffect } from 'react'
import styles from './Home.module.scss'
import axios from 'axios'
import { Box, Button, Container, LinearProgress, Stack, TextField, Typography } from '@mui/material'

export default function Home() {
  const [url, setUrl] = useState('')
  const [scanId, setScanId] = useState('')
  const [progress, setProgress] = useState('')
  const [summary, setSummary] = useState<any>({})
  const [alerts, setAlerts] = useState<any>([])
  const intervalRef = useRef<number | null>(null)
  const [progress2, setProgress2] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress2((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

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
      return <button className={styles.buttonVerificar} onClick={stopScan}>INTERROMPER</button>
    }
    return <button className={styles.buttonVerificar} onClick={startScan}>VERIFICAR</button>
  }

  return (
    <Container className={styles.containerHome} maxWidth="lg">
      <Stack>
        <Box className={styles.sectionOne}>
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            VERIFICADOR AUTOMÁTICO DE <Box component='span' sx={{ color: '#EC2026' }}>VULNERABILIDADES</Box> EM SITES INSTITUCIONAIS
          </Typography>
          <Typography variant='body1'>
            Obtenha uma verificação de segurança para sites institucionais e saiba as vulnerabilidades que nele possue, bem como as maneiras de soluciona-las.
          </Typography>
        </Box >

        <Box className={styles.sectionTwo}>
          <Box className={styles.header}>
            EXECUTE UMA VERIFICAÇÃO DE SEGURANÇA ABAIXO
          </Box>
          <Box className={styles.body}>
            <Box className={styles.search}>
              <input className={styles.inputLinkInstituicao} placeholder='https://www.siteinstitucional.com/' type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
              <OptionButton />
            </Box>
            <Box sx={{ width: '100%' }} className={styles.progressBar}>
              <LinearProgress variant="determinate" value={progress2} />
            </Box>
            <Typography variant='body1' className={styles.information}>
              *Buscaremos por vunerabilidades através... Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.            </Typography>
          </Box>
        </Box>

        <Box className={styles.sectionThre}>
          <Box className={styles.header}>
            RESULTADO DA VERIFICAÇÃO
          </Box>
          <Box className={styles.body}>
            corpo
          </Box>
        </Box>
      </Stack>
      {/* <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
      <OptionButton /> */}
      {/* {scanId && (
        <div>
          <p>Scan ID: {scanId}</p>
          <p>Status: {progress}</p>
        </div>
      )}
      {progress === '100' && summary && (
        <>
          <div>
            <p>Resumo de vulnerabilidades:</p>
            <ul>
              <li>Alta: {summary.High}</li>
              <li>Média: {summary.Medium}</li>
              <li>Baixa: {summary.Low}</li>
              <li>Informacional: {summary.Informational}</li>
            </ul>
          </div>
          <div>
            <p>Vulnerabilidades</p>
            {alerts.map((alert: any) => (
              <div key={alert.id}>
                <p>Alerta: {alert.alert}</p>
                <p>Descrição: {alert.description}</p>
                <p>Solução: {alert.solution}</p>
                <div style={{ border: '1px solid black' }}></div>
              </div>
            ))}
          </div>
        </>
      )} */}
    </Container>
  )
}
