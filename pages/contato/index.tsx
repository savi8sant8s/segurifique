import { Avatar, Box, Container, Stack, Typography } from '@mui/material'
import React from 'react'
import styles from './Contato.module.scss'

export default function Contact() {

    return (
        <Container className={styles.containerContact} maxWidth="lg">
            <Stack className={styles.sectionOne}>
                <h2>Equipe</h2>
                <br />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Avatar sizes='30' alt="Brenoly" src="https://avatars.githubusercontent.com/u/50916242?v=4" sx={{ width: 56, height: 56 }} />
                    <Box>
                        <h3>Brenoly Porto</h3>
                        <p>Estudante e desenvolvedor Frontend</p>
                    </Box>
                </Stack>
                <br />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Avatar sizes='30' alt="Sávio" src="https://avatars.githubusercontent.com/u/50780673?v=4" sx={{ width: 56, height: 56 }} />
                    <Box>
                        <h3>Sávio Santos</h3>
                        <p>Estudante e desenvolvedor Backend</p>
                    </Box>
                </Stack>
                <br />
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Avatar sizes='30' alt="Victor" src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }} />
                    <Box>
                        <h3>Victor Ferreira</h3>
                        <p>Professor e orientador</p>
                    </Box>
                </Stack>
            </Stack>
        </Container>
    )
}