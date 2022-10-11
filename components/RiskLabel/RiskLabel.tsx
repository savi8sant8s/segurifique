import React from 'react'
import { Box } from '@mui/material'

interface IRiskLabel {
    typeRisk: string
}

export const RiskLabel = ({ typeRisk }: IRiskLabel) => {
    if (typeRisk === 'High') {
        return <React.Fragment>
            <Box component='strong' style={{ color: 'red' }}>Alto</Box>
        </React.Fragment>
    } else if (typeRisk === 'Medium') {
        return <React.Fragment>
            <Box component='strong' style={{ color: 'orange' }}>Médio</Box>
        </React.Fragment>
    } else if (typeRisk === 'Low') {
        return <React.Fragment>
            <Box component='strong' style={{ color: 'green' }}>Baixo</Box>
        </React.Fragment>
    } else if (typeRisk === 'Informational') {
    }
    return <React.Fragment>
        <Box component='strong' style={{ color: 'blue' }}>Informacional</Box>
    </React.Fragment>
}