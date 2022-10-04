import { useState } from 'react'
import styles from './Home.module.scss'
import axios from 'axios'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Container,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { BarChartRace, Summary, TableCustom } from '@/components'
import { isValidUrl } from '@/helpers'

export default function Home() {
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

  const [alerts, setAlerts] = useState<object[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const clearFormAndInfo = (clearOnlyResults = false) => {
    if (clearOnlyResults) {
      setAlerts([])
      setSummary({
        High: 0,
        Medium: 0,
        Low: 0,
        Informational: 0,
      })
      return
    }
    setUrl('')
    setScanId('')
    setProgress('0%')
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const startScan = async () => {
    const validUrl = isValidUrl(url)
    if (!validUrl) {
      alert('URL inválida. Verifique e tente novamente.')
    } else {
      clearFormAndInfo(true)
      try {
        const { data } = await axios.get(`/api/scan?url=${url}`)
        if (data.status === 'SCANNED') {
          setProgress('100%')
          setTimeout(async () => {
            await getAlertsSummary()
            await getFirstAlerts()
          }, 1000)
        } else {
          setScanId(data.scan)
          await getStatus(data.scan)
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    }
  }

  const getStatus = async (scanId: string) => {
    const { data } = await axios.get(`/api/scan/status/${scanId}`)
    setProgress(data.status + '%')
    if (data.status === '100') {
      await getAlertsSummary()
      await getFirstAlerts()
    } else {
      await getStatus(scanId)
    }
  }

  const getFirstAlerts = async () => {
    const { data } = await axios.get('/api/alerts', {
      params: {
        url,
        first: true,
      },
    })
    setAlerts(data)
  }

  const getAlertsSummary = async () => {
    setSummaryLoading(true)
    const { data } = await axios.get('/api/alerts/summary', {
      params: {
        url,
      },
    })
    setSummaryLoading(false)
    setSummary(data)
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
            EXECUTE UMA VERIFICAÇÃO BÁSICA DE SEGURANÇA ABAIXO
            <Tooltip
              title={
                'Busca não recursiva, restringida a sub-árvore do site e com números de filhos verificados igual a 1.'
              }
            >
              <IconButton>
                <InfoIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className={styles.body}>
            <Box className={styles.search}>
              <input
                disabled={scanId !== '' && progress !== '100%'}
                className={styles.inputLinkInstituicao}
                placeholder="https://www.siteinstitucional.br"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <button
                disabled={scanId !== '' && progress !== '100%'}
                className={styles.buttonVerificar}
                onClick={startScan}
              >
                Verificar
              </button>
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
          </Box>
        </Box>

        {alerts.length > 0 && (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              <TableCustom
                rows={alerts}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
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
