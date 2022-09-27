import { Box, Container, Stack } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import styles from './Header.module.scss'

export const Header = () => {

    return (
        <Stack className={styles.container}>
            <Container maxWidth='lg'>
                <Stack className={styles.headerBody}>
                    <Box>
                        <img src='https://i.imgur.com/Mu0hhDs.png' alt='logoSegurifique' />
                    </Box>
                    <Box>
                        <Link href="/">
                            <Box component='a' title='Inicio'>Inicio</Box>
                        </Link>
                        <Link href="/contato">
                            <Box component='a' title='Contato'>Contato</Box>
                        </Link>
                        <Link href="/sobre">
                            <Box component='a' title='Sobre'>Sobre</Box>
                        </Link>
                    </Box>
                </Stack>
            </Container>
        </Stack>
    )
}
