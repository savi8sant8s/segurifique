import { useRef, useState, useEffect } from 'react'
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

interface Data {
  risco: string
  titulo: string
  descricao: string
  solucao: string
  link: string
}

function createData(
  risco: string,
  titulo: string,
  descricao: string,
  solucao: string,
  link: string
): Data {
  return { risco, titulo, descricao, solucao, link }
}

const rows = [
  createData(
    'Alto',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'https://www.google.com.br/?gws_rd=cr&ei=qBsTWZ3lEIqowgSp9Je4CA'
  ),
  createData(
    'Informacional',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone2'
  ),
  createData(
    'Médio',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
  createData(
    'Baixo',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
  createData(
    'Alto',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
  createData(
    'Alto',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
  createData(
    'Alto',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
  createData(
    'Alto',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged',
    'icone'
  ),
]

enum Status {
  STOPPED,
  SCANNING,
  FINISHED,
  NOSEARCH,
}

export default function Home() {
  const [status, setStatus] = useState<Status>(Status.NOSEARCH)
  const [url, setUrl] = useState('')
  const [scanId, setScanId] = useState('')
  const [progress, setProgress] = useState<number>(0)
  const [summary, setSummary] = useState<Summary>({
    High: 0,
    Medium: 0,
    Low: 0,
    Informational: 0,
  })
  const controller = new AbortController()
  const [alerts, setAlerts] = useState<any>([])
  const intervalRef = useRef<number | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const isValidUrl = (url: string) => {
    const pattern = new RegExp(
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
    )
    return pattern.test(url)
  }

  const clearData = () => {
    window.clearInterval(intervalRef.current)
    controller.abort()
    setUrl('')
    setScanId('')
    setProgress(0)
    setSummary({
      High: 0,
      Medium: 0,
      Low: 0,
      Informational: 0,
    })
  }

  const startScan = async () => {
    if (!isValidUrl(url)) {
      alert('URL inválida. Verifique e tente novamente.')
    } else {
      axios
        .get(`/api/scan?url=${url}`, {
          signal: controller.signal,
        })
        .then((res) => {
          setStatus(Status.SCANNING)
          intervalRef.current = window.setInterval(async () => {
            await scanStatus(res.data.scan)
          }, 2000)
        })
    }
  }

  const stopScan = async () => {
    axios
      .put(`/api/scan/stop/${scanId}`, {
        signal: controller.signal,
      })
      .then(() => {
        setStatus(Status.STOPPED)
        clearData()
      })
  }

  const scanStatus = async (scanId: string) => {
    axios
      .get(`/api/scan/status/${scanId}`, {
        signal: controller.signal,
      })
      .then(async (res) => {
        setProgress(res.data.status)
        await getAlertsSummary()
        if (res.data.status === '100' && intervalRef.current) {
          window.clearInterval(intervalRef.current)
          setStatus(Status.FINISHED)
          await getAlerts()
        }
      })
  }

  const getAlertsSummary = async () => {
    axios
      .get(`/api/alerts/summary?url=${url}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setSummary(res.data)
      })
  }

  const getAlerts = async () => {
    axios
      .get(`/api/alerts?url=${url}`, {
        signal: controller.signal,
      })
      .then((res) => {
        setAlerts(res.data)
      })
  }

  const OptionButton = () => {
    if ([Status.SCANNING].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={stopScan}>
          INTERROMPER
        </button>
      )
    }
    if ([Status.NOSEARCH, Status.STOPPED].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={startScan}>
          VERIFICAR
        </button>
      )
    }
    if ([Status.FINISHED].includes(status)) {
      return (
        <button className={styles.buttonVerificar} onClick={clearData}>
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
            {status !== Status.NOSEARCH && (
              <>
                <Box sx={{ width: '100%' }} className={styles.progressBar}>
                  <LinearProgress
                    style={{ width: '95%' }}
                    variant="determinate"
                    value={progress}
                  />
                  <span style={{ marginLeft: '1rem' }}>{progress}%</span>
                </Box>

                <Box>
                  <BarChartRace summary={summary} />
                </Box>
              </>
            )}

            <Typography variant="body1" className={styles.information}>
              - Buscaremos por vulnerabilidades através do 
              <a style={{textDecoration: 'none'}} href="https://www.zaproxy.org/"> OWASP ZAP</a>,
              o <strong>web scanner mais utilizado do mundo</strong>.<br /> 
              - Gratuito, de código aberto e ativamente mantido por uma equipe 
              internacional de voluntários.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.sectionThre}>
          <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
          <Box className={styles.body}>
            <TableCustom
              rows={rows}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              key="table1"
            />
          </Box>
        </Box>
      </Stack>
    </Container>
  )
}
