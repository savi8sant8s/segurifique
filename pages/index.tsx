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
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { BarChartRace, Summary, TableCustom } from '@/components'
import { isValidUrl, translateRisk } from '@/helpers'
import { PdfGenerator } from '@/components/PdfGenerator/PdfGenerator'
import { TabPanel } from '@/components/TabPanel/TabPanel'

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
  const [protocolo, setProtocolo] = useState('https://')
  const [vulnerabilities, setVulnerabilities] = useState<object[]>([])
  const [vulnerabilitiesFiltered, setVulnerabilitiesFiltered] = useState<object[]>([])
  const [chosenFilter, setChosenFilter] = useState('')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchComplete, setSearchComplete] = useState(true)

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue === 0) {
      console.log('searchComplete', searchComplete);
      setSearchComplete(true);
    } else {
      console.log('searchComplete', searchComplete);
      setSearchComplete(false);
    }
  };

  const handleDelete = () => {
    setChosenFilter('');
    setVulnerabilitiesFiltered([]);
  };

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

  const startScan = async () => {
    const validUrl = isValidUrl(`${protocolo}${url}`);
    if (!validUrl) {
      alert('URL inválida. Verifique e tente novamente.')
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
        first: searchComplete,
      },
    })
    setVulnerabilities(data)
  }

  const getAlertsSummary = async () => {
    setSummaryLoading(true)
    const { data } = await axios.get('/api/alerts/summary', {
      params: {
        url: `${protocolo}${url}`,
      },
    })
    setSummaryLoading(false)
    setSummary(data)
  }

  const removeHttp = (url: string) => {
    return url.replace(/^https?:\/\//, '');
  }

  const numberOfVulnerabilitiesFound = () => {
    return summary.High + summary.Informational + summary.Low + summary.Medium;
  }

  const filterTable = () => {
    const _vulnerabilitiesFiltered = vulnerabilities.filter(teste => teste.risk === chosenFilter);
    setVulnerabilitiesFiltered(_vulnerabilitiesFiltered);
  }

  useEffect(() => {
    if (chosenFilter == '') return;
    filterTable();
  }, [chosenFilter])

  useEffect(() => {
    console.log(vulnerabilities)
  }, [vulnerabilities])

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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label="Verificação Rápida" />
                <Tab label="Verificação Completa" />
              </Tabs>
            </Box>

            <TabPanel value={value} index={0}>
              <Box component='span'>
                Executaremos uma verificação rápida, mostrando no relatório apenas uma amostra das vulnerabilidades encontradas.
              </Box>
              <Box className={styles.search}>
                <TextField
                  id="outlined-select-currency"
                  className={styles.inputSelectProtocolo}
                  select
                  label="Protocolo"
                  value={protocolo}
                  onChange={e => setProtocolo(e.target.value)}
                >
                  <MenuItem key='https://' value='https://'>https://</MenuItem>
                  <MenuItem key='http://' value='http://'>http://</MenuItem>
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
                  onChange={(e) =>
                    setUrl(removeHttp(e.target.value))
                  }
                />
                <Button
                  variant="outlined"
                  disabled={scanId !== '' && progress !== '100%'}
                  onClick={startScan}
                  className={styles.buttonVerificar}
                >
                  {scanId !== '' && progress !== '100%' ? (
                    <CircularProgress size="1rem" sx={{ color: 'grey.500' }} color="inherit" />
                  ) : 'Verificar'}
                </Button>
              </Box>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Box component='span'>
                Executaremos uma verificação completa, mostrando no relatório todas as vulnerabilidades encontradas.
              </Box>
              <Box className={styles.search}>
                <TextField
                  id="outlined-select-currency"
                  className={styles.inputSelectProtocolo}
                  select
                  label="Protocolo"
                  value={protocolo}
                  onChange={e => setProtocolo(e.target.value)}
                >
                  <MenuItem key='https://' value='https://'>https://</MenuItem>
                  <MenuItem key='http://' value='http://'>http://</MenuItem>
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
                  onChange={(e) =>
                    setUrl(removeHttp(e.target.value))
                  }
                />
                <Button
                  variant="outlined"
                  disabled={scanId !== '' && progress !== '100%'}
                  onClick={startScan}
                  className={styles.buttonVerificar}
                >
                  {scanId !== '' && progress !== '100%' ? (
                    <CircularProgress size="1rem" sx={{ color: 'grey.500' }} color="inherit" />
                  ) : 'Verificar'}
                </Button>
              </Box>
            </TabPanel>

            <Typography variant="body1" className={styles.information}>
              - Buscaremos por vulnerabilidades através do
              <Box
                component='a'
                sx={{ textDecoration: 'none' }}
                href="https://www.zaproxy.org/"
              >
                {' '}
                OWASP ZAP
              </Box>
              , o <Box component='strong'>web scanner mais utilizado do mundo</Box>.<br />-
              Gratuito, de código aberto e ativamente mantido por uma equipe
              internacional de voluntários.
            </Typography>
            <Box sx={{ width: '100%' }} className={styles.progressBar}>
              <LinearProgress
                style={{ width: '95%' }}
                variant="determinate"
                value={Number(progress.slice(0, -1))}
              />
              <Box component='span' style={{ marginLeft: '1rem' }}>{progress}</Box>
            </Box>
            <Box>
              {summaryLoading && (
                <LinearProgress
                  style={{ width: '100%', marginTop: '0.5rem' }}
                  variant="query"
                />
              )}
            </Box>
          </Box>
        </Box>


        {vulnerabilities.length > 0 ? (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              {vulnerabilities.length > 0 && (
                <Typography>
                  A verificação encontrou cerca de
                  <Box component='strong'>{` ${numberOfVulnerabilitiesFound()} `}</Box>
                  vunerabilidades para o site
                  <Box component='strong'>{` ${removeHttp(url)}`}</Box>.
                  Abaixo, um gráfico categorizado pelo grau de risco
                  de todas as vunerabildiades encontradas. Para filtrar a tabela,
                  clique no rescpectivo grau de risco.
                </Typography>
              )}
              <BarChartRace
                NumberOfVulnerabilitiesFound={vulnerabilities.length}
                setChosenFilter={setChosenFilter}
                summary={summary}
              />
              <br />
              {vulnerabilities.length > 0 && (
                <>
                  <Box>

                  </Box>
                  <Box sx={{ marginBottom: '16px' }}>Filtrado por:
                    {chosenFilter != '' ? (
                      <Chip
                        label={translateRisk(chosenFilter)}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <Chip
                        label="Nenhum filtro selecionado"
                      />
                    )}</Box>
                </>
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
              <PdfGenerator data={{}} />
            </Box>
          </Box>
        ) : (
          <Box className={styles.sectionThre}>
            <Box className={styles.header}>RESULTADO DA VERIFICAÇÃO</Box>
            <Box className={styles.body}>
              Inicie uma verificação para obter os resutados!
            </Box>
          </Box>
        )}
      </Stack>
    </Container>
  )
}
