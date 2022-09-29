import React, { useState } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'

export const BarChartRace = () => {
    function getRandomArbitrary(min, max) {
        return Math.trunc(Math.random() * (max - min) + min);
    }

    const [data, setData] = useState([
        {
            id: 1,
            type: 'Alto',
            color: 'red',
            value: 0,
        },
        {
            id: 2,
            type: 'Médio',
            color: 'orange',
            value: 0,
        },
        {
            id: 3,
            type: 'Baixo',
            color: '#a8aa21',
            value: 0,
        },
        {
            id: 4,
            type: 'Informacional',
            color: 'blue',
            value: 0,
        },
    ])

    const mover = () => {
        setData([
            {
                id: 1,
                type: 'Alto',
                color: 'red',
                value: getRandomArbitrary(0, 100),
            },
            {
                id: 2,
                type: 'Médio',
                color: 'orange',
                value: getRandomArbitrary(0, 100),
            },
            {
                id: 3,
                type: 'Baixo',
                color: '#a8aa21',
                value: getRandomArbitrary(0, 100),
            },
            {
                id: 4,
                type: 'Informacional',
                color: 'blue',
                value: getRandomArbitrary(0, 100),
            },
        ])
    }

    const toWidth = (value: number) => {
        if (value === 0) return 0
        const sum = data.reduce((acc, item) => acc + item.value, 0)
        return (value / sum) * 100
    }

    return (
        <>
            <button onClick={mover}>Mover</button>
            <Flipper flipKey={data.map((item) => item.id).join("")}>
                <div style={{ backgroundColor: '#343434', borderRadius: '8px', padding: '16px 0', marginTop: '16px' }}>
                    {data.map((item) => (
                        <Flipped key={item.id} flipId={item.id}>
                            <div
                                style={{
                                    transition: 'width 2s',
                                    width: toWidth(item.value) + '%',
                                    minWidth: '150px',
                                    background: item.value === 0 ? 'black' : item.color,
                                    height: '30px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '8px 0',
                                    borderRadius: '0 16px 16px 0'
                                }}
                            >
                                <strong style={{ marginLeft: '8px', color: 'white' }}>{`${item.type} (${item.value})`}</strong>
                            </div>
                        </Flipped>
                    ))}
                </div>
            </Flipper>
        </>
    )
}