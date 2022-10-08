import { translateRisk } from '@/helpers'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import styles from './BarChartRace.module.scss'

export type BarChartRaceProps = {
  summary: Summary
  setChosenFilter: (newValue: string) => void
  NumberOfVulnerabilitiesFound: number
}

export type Summary = {
  High: number
  Low: number
  Medium: number
  Informational: number
}

export type Data = {
  id: number
  color: string
  value: number
  title: string
}

export const BarChartRace = ({ summary, setChosenFilter, NumberOfVulnerabilitiesFound }: BarChartRaceProps) => {
  const [data, setData] = useState<Data[]>([])

  const toName = (key: string) => {
    return {
      High: 'High',
      Low: 'Low',
      Medium: 'Medium',
      Informational: 'Informational',
    }[key]
  }

  const toColor = (key: string) => {
    return {
      High: 'red',
      Low: 'green',
      Medium: 'orange',
      Informational: 'blue',
    }[key]
  }

  const toWidth = (value: number) => {
    if (value === 0) return 0
    const sum = data.reduce((acc, item) => acc + item.value, 0)
    return (value / sum) * 100
  }

  useEffect(() => {
    const sortSummary = Object.entries(summary).sort((a, b) => b[1] - a[1])
    const data = new Array<Data>()
    sortSummary.map(([key, value], idx) => {
      data.push({
        id: idx,
        color: toColor(key) as string,
        value,
        title: toName(key) as string,
      })
    })
    setData(data)
  }, [summary])

  return (
    <Flipper flipKey={data.map((item) => item.id).join('')}>
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          borderRadius: '8px',
          padding: '16px 16px 16px 0',
          marginTop: '16px',
        }}
      >
        {data.map((item, index) => (
          <Flipped key={index} flipId={index}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div
                className={NumberOfVulnerabilitiesFound <= 0 || item.value <= 0 ? styles.containerRiskBar : styles.containerRiskBarHover}
                onClick={() => NumberOfVulnerabilitiesFound > 0 && item.value > 0 && setChosenFilter(item.title)}
                style={{
                  width: toWidth(item.value) + '%',
                  background: item.color,
                  opacity: item.value === 0 ? 0.5 : 1,
                }}
              >
                <strong
                  style={{ marginLeft: '8px', color: 'white', fontSize: '0.75rem' }}
                >{`${translateRisk(item.title)} (${item.value})`}</strong>
              </div>
              {/* <div className={styles.filterClose} onClick={() => setChosenFilter('')}>X</div> */}
            </Box>
          </Flipped>
        ))}
      </div>
    </Flipper>
  )
}
