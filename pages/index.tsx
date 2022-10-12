import React, { useEffect, useState } from 'react'
import styles from './Home.module.scss'
import axios from 'axios'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { BarChartRace, Summary, TableCustom, PdfGenerator } from '@/components'
import { isValidUrl, translateRisk } from '@/helpers'
import { useGoogleLogin } from '@react-oauth/google'

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
  const [protocolo, setProtocolo] = useState('https://')
  const [vulnerabilities, setVulnerabilities] = useState<object[]>([])
  const [vulnerabilitiesFiltered, setVulnerabilitiesFiltered] = useState<
    object[]
  >([])
  const [chosenFilter, setChosenFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchComplete, setSearchComplete] = useState(true)
  const [modalState, setModalState] = React.useState(false)
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      sessionStorage.setItem(
        'segurifique-google-user-token',
        response.access_token
      )
      await startScan()
    },
  })

  const handleDelete = () => {
    setChosenFilter('')
    setVulnerabilitiesFiltered([])
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const clearFormAndInfo = (clearOnlyResults = false) => {
    if (clearOnlyResults) {
      setVulnerabilities([])
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

  const googleUserToken = () => {
    return sessionStorage.getItem('segurifique-google-user-token')
  }

  const startScan = async () => {
    const validUrl = isValidUrl(`${protocolo}${url}`)
    if (!validUrl) {
      alert('URL inválida. Verifique e tente novamente.')
    } else if (!googleUserToken()) {
      await googleLogin()
    } else {
      clearFormAndInfo(true)
      try {
        const { data } = await axios.get(`/api/scan?url=${protocolo}${url}`)
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
      } catch (error: any) {
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
        url: `${protocolo}${url}`,
      },
    })
    setVulnerabilities(data)
  }

  const getAlertsSummary = async () => {
    const { data } = await axios.get('/api/alerts/summary', {
      params: {
        url: `${protocolo}${url}`,
      },
    })
    setSummary(data)
  }

  const removeHttp = (url: string) => {
    return url.replace(/^https?:\/\//, '')
  }

  const numberOfVulnerabilitiesFound = () => {
    return summary.High + summary.Informational + summary.Low + summary.Medium
  }

  const filterTable = () => {
    const _vulnerabilitiesFiltered = vulnerabilities.filter(
      (teste: any) => teste.risk === chosenFilter
    )
    setVulnerabilitiesFiltered(_vulnerabilitiesFiltered)
  }

  useEffect(() => {
    if (chosenFilter == '') return
    filterTable()
  }, [chosenFilter])

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
              <TextField
                id="outlined-select-currency"
                className={styles.inputSelectProtocolo}
                select
                label="Protocolo"
                value={protocolo}
                onChange={(e) => setProtocolo(e.target.value)}
              >
                <MenuItem key="https://" value="https://">
                  https://
                </MenuItem>
                <MenuItem key="http://" value="http://">
                  http://
                </MenuItem>
              </TextField>
              <TextField
                size="medium"
                id="outlined-basic"
                className={styles.inputLinkInstituicao}
                label="Site Institucional"
                variant="outlined"
                disabled={scanId !== '' && progress !== '100%'}
                placeholder="www.siteinstitucional.br"
                value={removeHttp(url)}
                onChange={(e) => setUrl(removeHttp(e.target.value))}
              />
              <Button
                variant="outlined"
                disabled={scanId !== '' && progress !== '100%'}
                onClick={startScan}
                className={styles.buttonVerificar}
              >
                {scanId !== '' && progress !== '100%' ? (
                  <CircularProgress
                    size="1rem"
                    sx={{ color: 'grey.500' }}
                    color="inherit"
                  />
                ) : (
                  'Verificar'
                )}
              </Button>
            </Box>
            <Typography variant="body1" className={styles.information}>
              - Buscaremos por vulnerabilidades através do
              <Box
                component="a"
                sx={{ textDecoration: 'none' }}
                href="https://www.zaproxy.org/"
              >
                {' '}
                OWASP ZAP
              </Box>
              , o{' '}
              <Box component="strong">web scanner mais utilizado do mundo</Box>.
              <br />- Gratuito, de código aberto e ativamente mantido por uma
              equipe internacional de voluntários.
            </Typography>
            <Box sx={{ width: '100%' }} className={styles.progressBar}>
              <LinearProgress
                className={styles.linearProgress}
                variant="determinate"
                value={Number(progress.slice(0, -1))}
              />
              <Box component="span" style={{ marginLeft: '1rem' }}>
                {progress}
              </Box>
            </Box>
          </Box>
        </Box>

        {vulnerabilities.length > 0 ? (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              {vulnerabilities.length > 0 && (
                <Typography>
                  A verificação conseguiu encontrar cerca de
                  <Box component="strong">{` ${numberOfVulnerabilitiesFound()} `}</Box>
                  vunerabilidades. Abaixo, um gráfico categorizado pelo grau de
                  risco de todas as vunerabildiades encontradas. Para filtrar a
                  tabela, clique no respectivo grau de risco mostrado no
                  gráfico.
                </Typography>
              )}
              <BarChartRace
                NumberOfVulnerabilitiesFound={vulnerabilities.length}
                setChosenFilter={setChosenFilter}
                summary={summary}
              />
              <br />
              {vulnerabilities.length > 0 && (
                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    marginBottom: '1rem',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setModalState(true)}
                    className={styles.buttonRelatorioCompleto}
                  >
                    VER RELATÓRIO COMPLETO
                  </Button>
                  <Box>
                    Filtrado por:
                    {chosenFilter != '' ? (
                      <Chip
                        label={translateRisk(chosenFilter)}
                        onDelete={handleDelete}
                        sx={{ marginLeft: '8px' }}
                      />
                    ) : (
                      <Chip
                        label="Nenhum filtro selecionado"
                        sx={{ marginLeft: '8px' }}
                      />
                    )}
                  </Box>
                </Stack>
              )}
              {vulnerabilitiesFiltered.length > 0 ? (
                <TableCustom
                  vulnerabilities={vulnerabilitiesFiltered}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  handleChangePage={handleChangePage}
                />
              ) : (
                <TableCustom
                  vulnerabilities={vulnerabilities}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  handleChangeRowsPerPage={handleChangeRowsPerPage}
                  handleChangePage={handleChangePage}
                />
              )}
              <PdfGenerator
                summary={summary}
                url={`${protocolo}${url}`}
                modalState={modalState}
                setModalState={setModalState}
                data={vulnerabilities}
              />
            </Box>
          </Box>
        ) : (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              Inicie uma verificação para obter os resultados!
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
