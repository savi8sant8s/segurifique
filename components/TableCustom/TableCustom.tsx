import React from 'react'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material'

interface Column {
  id: 'risk' | 'alert' | 'description' | 'solution' | 'references'
  label: string
  minWidth?: number
}

const columns: readonly Column[] = [
  { id: 'risk', label: 'Risco' },
  { id: 'alert', label: 'Título', minWidth: 150 },
  { id: 'description', label: 'Descrição' },
  { id: 'solution', label: 'Solução' },
  { id: 'references', label: 'Link' },
]

interface PropsTableCustom {
  rows: any
  page: number
  rowsPerPage: number
  handleChangePage: any
  handleChangeRowsPerPage: any
}

interface IRiskLabel {
  typeRisk: string
}

export const TableCustom = ({
  rows,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}: PropsTableCustom) => {
  const defaultLabelDisplayedRows = () => {
    return null
  }

  const RiskLabel = ({ typeRisk }: IRiskLabel) => {
    if (typeRisk === 'Alto') {
      return <strong style={{ color: 'red' }}>{typeRisk}</strong>
    } else if (typeRisk === 'Médio') {
      return <strong style={{ color: 'orange' }}>{typeRisk}</strong>
    } else if (typeRisk === 'Baixo') {
      return <strong style={{ color: '#a8aa21' }}>{typeRisk}</strong>
    } else if (typeRisk === 'Informacional') {
      return <strong style={{ color: 'blue' }}>{typeRisk}</strong>
    }
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 840 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: '#343434',
                    color: 'white',
                    fontWeight: 'bold',
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id]
                      return (
                        <TableCell key={column.id}>
                          {column.id === 'risk' ? (
                            <RiskLabel typeRisk={`${value}`} />
                          ) : null}
                          {column.id !== 'references' && column.id !== 'risk'
                            ? value
                            : null}
                          {column.id === 'references' ? (
                            <ul>
                              {value
                                ?.split('\n')
                                .map((item: any, index: number) => (
                                  <li key={index}>{item}</li>
                                ))}
                            </ul>
                          ) : null}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={defaultLabelDisplayedRows}
      />
    </Paper>
  )
}
