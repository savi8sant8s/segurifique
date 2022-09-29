import React, { useEffect, useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'

export type BarChartRaceProps = {
  summary: Summary
}

export type Summary = {
    High: number
    Low: number
    Medium: number
    Informational: number
}

export type Data = {
  color: string
  value: number
  title: string
}

export const BarChartRace = ({ summary }: BarChartRaceProps) => {
  const [data, setData] = useState<Data[]>([])

  const toName = (key: string) => {
    return {
      High: 'Alto',
      Low: 'Baixo',
      Medium: 'Médio',
      Informational: 'Informacional',
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
    sortSummary.map(([key, value]) => {
      data.push({
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
          backgroundColor: '#5d5d5d',
          borderRadius: '8px',
          padding: '16px 0',
          marginTop: '16px',
        }}
      >
        {data.map((item, index) => (
          <Flipped key={index} flipId={index}>
            <div
              style={{
                transition: 'width 2s',
                width: toWidth(item.value) + '%',
                minWidth: '9.375rem',
                background: item.color,
                opacity: item.value === 0 ? 0.5 : 1,
                height: '1.875rem',
                display: 'flex',
                alignItems: 'center',
                padding: '.25rem',
                margin: '.5rem 0',
                borderRadius: '0 1rem 1rem 0',
              }}
            >
              <strong
                style={{ marginLeft: '8px', color: 'white', fontSize: '0.75rem' }}
              >{`${item.title} (${item.value})`}</strong>
            </div>
          </Flipped>
        ))}
      </div>
    </Flipper>
  )
}
