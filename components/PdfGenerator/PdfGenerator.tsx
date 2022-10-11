import { Box, Button, Modal, Stack, Typography } from '@mui/material';
import React, { useRef } from 'react'
import styles from './PdfGenerator.module.scss'
import { RiskLabel } from '../RiskLabel/RiskLabel';

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

    function printDiv(divId: string, title: string) {
        const mywindow = window.open('', 'PRINT', 'height=650,width=900,top=100,left=150');

        mywindow!.document.write(`<html><head><title>${title}</title>`);
        mywindow!.document.write('</head><body >');
        mywindow!.document.write(document.getElementById(divId)!.innerHTML);
        mywindow!.document.write('</body></html>');
        mywindow!.document.close();
        mywindow!.focus();
        mywindow!.print();
        mywindow!.close();

        return true;
    }

    const RiskDetails = ({ vulnerabilities, idx }: any) => {
        return (
            <Box className={styles.bodyRisck}>
                <Typography style={{ fontWeight: 'bold' }}>
                    {idx + 1} | {' '}
                    <RiskLabel typeRisk={`${vulnerabilities.risk}`} />{' '} - {vulnerabilities.name}
                </Typography>
                <br />
                <Typography style={{ margin: '0', padding: '0' }}>
                    <Box component='strong'>Descrição:</Box> {vulnerabilities.description}
                </Typography>
                <br />
                <Typography style={{ margin: '0', padding: '0' }}>
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
                        <Button
                            variant="outlined"
                            onClick={() => printDiv('pdfView', 'RelatorioCompleto')}
                            className={styles.buttonDownloadPdf}
                        >
                            BAIXAR RELATÓRIO EM PDF
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClose}
                            className={styles.buttonHandleClose}
                        >
                            Fechar
                        </Button>
                    </Stack>
                    <Box id='pdfView' className={styles.pdfContainer} ref={ref}>
                        <Typography
                            style={{
                                fontWeight: 'bold',
                                fontSize: '24px'
                            }}
                        >
                            <Box component='span' style={{ fontSize: '28px', color: 'red' }}>
                                {data.length}
                            </Box>
                            {" "}
                            VULNERABILIDADES ENCONTRADAS PARA O SITE
                            {" "}
                            {url}
                        </Typography>
                        <Typography
                            style={{
                                marginTop: '16px',
                                fontWeight: 'bold',
                                fontSize: '20px'
                            }}
                        >
                            Resumo dos riscos
                        </Typography>
                        <Stack
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                marginBottom: '16px'
                            }}
                        >
                            <Box style={{ marginRight: '16px' }}>Alto Risco: {summary.High}</Box>
                            <Box style={{ marginRight: '16px' }}>Médio Risco: {summary.Medium}</Box>
                            <Box style={{ marginRight: '16px' }}>Baixo Risco: {summary.Low}</Box>
                            <Box style={{ marginRight: '16px' }}>Risco Informacional: {summary.Informational}</Box>
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