import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import styles from './PdfGenerator.module.scss'
import Pdf from "react-to-pdf";
import { RiskLabel } from '../RiskLabel/RiskLabel';
import { ConstructionOutlined } from '@mui/icons-material';

interface Idata {
    data: any;
    modalState: boolean;
    setModalState: (newValue: boolean) => void;
    url: string;
    summary: any;
}

export const PdfGenerator = ({ data, modalState, setModalState, url, summary }: Idata) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleClose = () => setModalState(false);

    const downloadPdf = (toPdf: any) => {
        if (document.getElementById('pdfView') === null) return;
        console.log('document.getElementById', document.getElementById('pdfView'));
        document.getElementById('pdfView')!.style.height = 'auto';
        toPdf();
        setTimeout(() => {
            document.getElementById('pdfView')!.style.height = '80vh';
        }, 1000)
    }

    useEffect(() => {
        console.log('data', data);
    }, [data])

    const RiskDetails = ({ vulnerabilities, idx }: any) => {
        return (
            <Box className={styles.bodyRisck}>
                <Typography className={styles.title}>
                    {idx + 1} | {' '}
                    <RiskLabel typeRisk={`${vulnerabilities.risk}`} />{' '} - {vulnerabilities.name}
                </Typography>
                <br />
                <Typography className={styles.Descrição}>
                    <Box component='strong'>Descrição:</Box> {vulnerabilities.description}
                </Typography>
                <br />
                <Typography className={styles.Solução}>
                    <Box component='strong'>Solução:</Box> {vulnerabilities.solution}
                </Typography>
                <hr />
            </Box>
        )
    }

    return (
        <Box>
            <Modal
                open={modalState}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={styles.modal}>
                    <Stack
                        direction='row'
                        justifyContent='space-between'
                        sx={{
                            margin: '0 24px',
                            marginTop: '16px',
                        }}
                    >
                        <Pdf scale={0.8} targetRef={ref} filename="relatorio.pdf">
                            {({ toPdf }: any) =>
                                <Button
                                    variant="outlined"
                                    onClick={() => downloadPdf(toPdf)}
                                    className={styles.buttonDownloadPdf}
                                >
                                    BAIXAR RELATÓRIO EM PDF
                                </Button>
                            }
                        </Pdf>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            className={styles.buttonHandleClose}
                        >
                            Fechar
                        </Button>
                    </Stack>
                    <Box id='pdfView' className={styles.pdfContainer} ref={ref}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '24px' }}>
                            <Box component='span' sx={{ fontSize: '28px', color: 'red' }}>
                                {data.length}
                            </Box>
                            {" "}
                            VULNERABILIDADES ENCONTRADAS PARA O SITE
                            {" "}
                            {url}
                        </Typography>
                        <Typography sx={{ marginTop: '16px', fontWeight: 'bold', fontSize: '20px' }}>
                            Resumo dos riscos
                        </Typography>
                        <Stack direction='row' gap={2} sx={{ marginBottom: '16px' }}>
                            <Box>Alto Risco: {summary.High}</Box>
                            <Box>Médio Risco: {summary.Medium}</Box>
                            <Box>Baixo Risco: {summary.Low}</Box>
                            <Box>Risco Informacional: {summary.Informational}</Box>
                        </Stack>
                        <hr style={{ marginBottom: '24px' }} />
                        {data.map((vulnerabilitie: any, idx: number) => (
                            <RiskDetails idx={idx} key={idx} vulnerabilities={vulnerabilitie} />)
                        )}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}