import { Container, Typography } from '@mui/material'
import React from 'react'
import styles from './Contato.module.scss'

export default function Contact() {

    return (
        <Container className={styles.containerContact} maxWidth="lg">
            <Typography variant='h1'>
                Contato
            </Typography>
        </Container>
    )
}