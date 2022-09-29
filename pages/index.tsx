import { useState } from 'react'
import styles from './Home.module.scss'
import axios from 'axios'
import {
  Box,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { BarChartRace, Summary, TableCustom } from '../components'

enum Status {
  STOPPED,
  SCANNING,
  FINISHED,
  NOSEARCH,
  CLEARED,
}

export default function Home() {
  const [status, setStatus] = useState<Status>(Status.NOSEARCH)
  const [url, setUrl] = useState('')
  const [scanId, setScanId] = useState('')
  const [progress, setProgress] = useState<string>('0%')
  const [summary, setSummary] = useState<Summary>({
    High: 0,
    Medium: 0,
    Low: 0,
    Informational: 0,
  })
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false)

  const [alerts, setAlerts] = useState<any>([])
  const [page, setPage] = useState(0)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const isValidUrl = (url: string) => {
    const pattern = new RegExp(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    )
    return pattern.test(url)
  }

  const clearFormAndInfo = () => {
    setUrl('')
    setScanId('')
    setProgress('0%')
    setAlerts([])
    setSummary({
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    })
    setStatus(Status.CLEARED)
  }

  const startScan = async () => {
    if (!isValidUrl(url)) {
      alert('URL inválida. Verifique e tente novamente.')
    } else {
      try {
        const { data }: any = await axios.get(`/api/scan?url=${url}`)
        if (data.status === 'SCANNED') {
          setProgress('100%')
          await getAlerts()
          setStatus(Status.FINISHED)
        } else {
          setScanId(data.scan)
          setStatus(Status.SCANNING)
          await getStatus(data.scan)
        }
      } catch ({ response }: any) {
        alert(response.data.message)
      }
    }
  }

  const stopScan = async () => {
    await axios.put(`/api/scan/stop/${scanId}`)
    setStatus(Status.STOPPED)
    clearFormAndInfo()
  }

  const getStatus = async (scanId: string) => {
    const { data }: any = await axios.get(`/api/scan/status/${scanId}`)
    setProgress(data.status + '%')
    if (data.status === '100') {
      setStatus(Status.FINISHED)
      await getAlerts()
    } else {
      await getStatus(scanId)
    }
  }

  const toName = (key: string) => {
    return {
      High: 'Alto',
      Low: 'Baixo',
      Medium: 'Médio',
      Informational: 'Informacional',
    }[key]
  }

  const getAlerts = async () => {
    setSummaryLoading(true)
    const { data }: any = await axios.get(`/api/alerts?url=${url}`)
    setSummaryLoading(false)
    const summary_ = {
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    }
    const items = data.map((item: any) => {
      summary_[item.confidence] += 1
      return {
        risk: toName(item.confidence),
        alert: item.alert,
        description: item.description,
        solution: item.solution,
        references: item.reference,
      }
    })
    setSummary(summary_)
    setAlerts(items)
  }

  const OptionButton = () => {
    if ([Status.SCANNING].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={stopScan}>
          INTERROMPER
        </button>
      )
    }
    if ([Status.NOSEARCH, Status.STOPPED, Status.CLEARED].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={startScan}>
          VERIFICAR
        </button>
      )
    }
    if ([Status.FINISHED].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={clearFormAndInfo}>
          LIMPAR
        </button>
      )
    }
  }

  return (
    <Container className={styles.containerHome} maxWidth="lg">
      <Stack>
        <Box className={styles.sectionOne}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            VERIFICADOR AUTOMÁTICO DE{' '}
            <Box component="span" sx={{ color: '#EC2026' }}>
              VULNERABILIDADES
            </Box>{' '}
            EM SITES INSTITUCIONAIS
          </Typography>
          <Typography variant="body1">
            Obtenha uma verificação de segurança para sites institucionais e
            saiba as vulnerabilidades que nele possui, bem como as maneiras de
            solucioná-las.
          </Typography>
        </Box>

        <Box className={styles.sectionTwo}>
          <Box className={styles.header}>
            EXECUTE UMA VERIFICAÇÃO DE SEGURANÇA ABAIXO
          </Box>
          <Box className={styles.body}>
            <Box className={styles.search}>
              <input
                disabled={status === Status.SCANNING}
                className={styles.inputLinkInstituicao}
                placeholder="https://www.siteinstitucional.br"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <OptionButton />
            </Box>

            <Typography variant="body1" className={styles.information}>
              - Buscaremos por vulnerabilidades através do
              <a
                style={{ textDecoration: 'none' }}
                href="https://www.zaproxy.org/"
              >
                {' '}
                OWASP ZAP
              </a>
              , o <strong>web scanner mais utilizado do mundo</strong>.<br />-
              Gratuito, de código aberto e ativamente mantido por uma equipe
              internacional de voluntários.
            </Typography>

            {status !== Status.NOSEARCH && (
              <>
                <Box sx={{ width: '100%' }} className={styles.progressBar}>
                  <LinearProgress
                    style={{ width: '95%' }}
                    variant="determinate"
                    value={Number(progress.slice(0, -1))}
                  />
                  <span style={{ marginLeft: '1rem' }}>{progress}</span>
                </Box>

                <Box>
                  {summaryLoading && (
                    <LinearProgress
                      style={{ width: '100%', marginTop: '0.5rem' }}
                      variant="query"
                    />
                  )}
                  <BarChartRace summary={summary} />
                </Box>
              </>
            )}
          </Box>
        </Box>

        {alerts.length > 0 && (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              <TableCustom
                rows={alerts}
                page={page}
                rowsPerPage={5}
                handleChangePage={handleChangePage}
                key="table1"
              />
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
