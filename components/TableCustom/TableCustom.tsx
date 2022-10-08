import React, { useEffect } from 'react'
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
  vulnerabilities: any
  page: number
  rowsPerPage: number
  handleChangePage: any
  handleChangeRowsPerPage: any
}

interface IRiskLabel {
  typeRisk: string
}

export const TableCustom = ({
  vulnerabilities,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
}: PropsTableCustom) => {
  const defaultLabelDisplayedRows = () => {
    return null
  }

  const RiskLabel = ({ typeRisk }: IRiskLabel) => {
    if (typeRisk === 'High') {
      return <React.Fragment>
        <strong style={{ color: 'red' }}>Alto</strong>
      </React.Fragment>
    } else if (typeRisk === 'Medium') {
      return <React.Fragment>
        <strong style={{ color: 'orange' }}>Médio</strong>
      </React.Fragment>
    } else if (typeRisk === 'Low') {
      return <React.Fragment>
        <strong style={{ color: 'green' }}>Baixo</strong>
      </React.Fragment>
    } else if (typeRisk === 'Informational') {
    }
    return <React.Fragment>
      <strong style={{ color: 'blue' }}>Informacional</strong>
    </React.Fragment>
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
            {vulnerabilities
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((vulnerabilities: any) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={vulnerabilities.code}>
                    {columns.map((column) => {
                      const value = vulnerabilities[column.id]
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
        count={vulnerabilities.length}
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
