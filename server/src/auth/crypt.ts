import crypto from 'crypto'
import config from '../config/config.js'

const algorithm = 'aes-256-cbc'

export const encryptString = (plainText: string) => {
  const iv = crypto.randomBytes(8).toString('hex') // a string with length 16

  const cipher = crypto.createCipheriv(algorithm, config.cipherSecret, iv)
  let encryptedValue = cipher.update(plainText, 'utf8', 'base64')
  encryptedValue += cipher.final('base64')
  // store iv!base64(encryptedValue)
  return `${iv}!${encryptedValue}`
}

export const decryptString = (encryptedValue: string) => {
  const parts = encryptedValue.split('!')
  if (parts.length !== 2) {
    throw new Error('The encrypted value is not a valid format')
  }
  const [iv, encryptedText] = parts
  if (iv.length !== 16) {
    throw new Error(`The encrypted value is not a valid format: ${iv.length}`)
  }
  // decrypt using aes256 iv + key + encryptedText = decryptedText
  const decipher = crypto.createDecipheriv(algorithm, config.cipherSecret, iv)
  let value = decipher.update(encryptedText, 'base64', 'utf8')
  value += decipher.final('utf8')
  return value
}
