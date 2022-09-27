import { Box, Container, Stack } from '@mui/material'
import React from 'react'
import styles from './Footer.module.scss'

export const Footer = () => {

    return (
        <Stack className={styles.container}>
            <Container maxWidth='lg'>
                <Stack className={styles.footerBody}>
                    <Box className={styles.bodyTextLeft}>
                        <img width={50} src='https://i.imgur.com/njhSime.png' alt='logoUPE' />
                        <Box className={styles.textLeft}>
                            <Box>
                                Copyright © 2022  - Todos os direitos reservados
                            </Box>
                            <Box>
                                Universidade de Pernambuco - Curso de Engenharia de Software
                            </Box>
                        </Box>
                    </Box>
                    <Box className={styles.textRigth}>
                        <Box>
                            Projeto de Segurança de Sistemas - Orientado por: Victor Ferreira
                        </Box>
                        <Box>
                            Desenvolvido por: Sávio Santos e Brenoly Porto
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </Stack>
    )
}
