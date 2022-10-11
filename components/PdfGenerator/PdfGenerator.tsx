import { Box, Button, Modal, Typography } from '@mui/material';
import React, { useRef } from 'react'
import styles from './PdfGenerator.module.scss'
import Pdf from "react-to-pdf";

interface Idata {
    data: any;
    modalState: boolean;
    setModalState: (newValue: boolean) => void;
}

export const PdfGenerator = ({ data, modalState, setModalState }: Idata) => {
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

    const RiskDetails = ({ risk }: any) => {
        return (
            <Box className={styles.bodyRisck}>
                <Typography className={styles.title}>
                    <Box component='strong'>{risk}</Box> - Lorem Ipsum is simply dummy text of the printing and typesetting industry
                </Typography>
                <br />
                <Typography className={styles.Descrição}>
                    <Box component='strong'>Descrição:</Box> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </Typography>
                <br />
                <Typography className={styles.Solução}>
                    <Box component='strong'>Solução:</Box> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                </Typography>
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
                    <Pdf targetRef={ref} filename="relatorio.pdf">
                        {({ toPdf }: any) =>
                            <Button
                                variant="outlined"
                                onClick={() => downloadPdf(toPdf)}
                            >
                                BAIXAR RELATÓRIO EM PDF
                            </Button>
                        }
                    </Pdf>
                    <Box id='pdfView' className={styles.pdfContainer} ref={ref}>
                        <Typography variant='h4'>
                            VULNERABILIDADES ENCONTRADAS PARA O SITE
                            “https://www.siteinstitucional.com/”
                        </Typography>
                        <Typography>
                            Resumo dos riscos encontrados
                        </Typography>
                        <Typography>
                            Detalhe dos riscos encontrados
                        </Typography>
                        {['Alto Risco', 'Baixo Risco', 'Baixo Risco', 'Baixo Risco', 'Médio Risco', 'Informacional Risco'].map((risk, idx) => (
                            <RiskDetails risk={risk} key={idx} />
                        )
                        )}
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}