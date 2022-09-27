import React from 'react'
import { Container, Typography } from '@mui/material'
import styles from './Sobre.module.scss'

export default function About() {

    return (
        <Container className={styles.containerAbout} maxWidth="lg">
            <Typography variant='h1'>
                Sobre
            </Typography>
        </Container>
    )
}