import { encryptString, decryptString } from '../../src/auth/crypt.js'

describe.only('auth', () => {
  it('encrypt decrypt', () => {
    const plainText = 'foobar'
    const enc1 = encryptString(plainText)
    const enc2 = encryptString(plainText)
    const dec1 = decryptString(enc1)
    const dec2 = decryptString(enc2)

    expect(dec1).toEqual(plainText)
    expect(dec2).toEqual(plainText)
  })
})
