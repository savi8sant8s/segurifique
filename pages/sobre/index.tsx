import React from 'react'
import { Container, Stack, Typography } from '@mui/material'
import styles from './Sobre.module.scss'

export default function About() {

    return (
        <Container className={styles.containerAbout} maxWidth="lg">
            <Stack className={styles.sectionOne}>
                <h2>Sobre o projeto</h2>
                <p>
                    O projeto consiste na verificação de vulnerabildades que sites institucionais podem ter. O
                    site verifica atraves do OWASP ZAP, que é o web scanner mais utilizado do mundo, gratuito, de código aberto e ativamente mantido por uma equipe internacional de voluntários,
                    e ao final da verificação é possivel gerar um relatório sobre os risco encontrados.
                </p>
                <p>
                    O projeto foi desenvolvido por estudantes do curso de <strong>Engenharia de software </strong>
                    da <strong>Universidade de Pernambuco - Campus Garanhuns,</strong> idealizado durante a vivência da disciplina de <strong>Segurança de Sistemas, </strong>
                    palestrada pelo professor e orientador do projeto <strong>Victor Ferreira. </strong>
                    O desenvolvimento foi feito pelos alunos: <strong>Brenoly Porto</strong> e <strong>Sávio Santos, </strong>
                    utilizando os ensinamentos aprendidos durante a vivência da disciplina.
                </p>
            </Stack>
        </Container>
    )
}