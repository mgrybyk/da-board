module.exports = (str, params) => {
  if (str === null || str === undefined) {
    return str
  }
  Object.keys(params).forEach(key => {
    str = str.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), params[key])
  })

  return str
}
