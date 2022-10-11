export const isValidUrl = (url: string) => {
  const pattern = new RegExp(
    /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/
  )
  return pattern.test(url)
}

export const translateRisk = (risk: string) => {
  if (risk === 'High') {
    return 'Alto';
  } else if (risk === 'Low') {
    return 'Baixo';
  } else if (risk === 'Medium') {
    return 'Médio';
  } else {
    return 'Informacional';
  }
}
