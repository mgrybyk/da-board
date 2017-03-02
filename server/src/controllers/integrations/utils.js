module.exports = (str, params) => {
  Object.keys(params).forEach(key => {
    str = str.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), params[key])
  })

  return str
}
