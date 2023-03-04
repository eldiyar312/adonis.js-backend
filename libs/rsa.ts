import NodeRSA from 'node-rsa'
import crypto from 'crypto'

export const generateRSAKeyPair = () => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    })

    const rsa = new NodeRSA(publicKey, 'pkcs1-public-pem', { encryptionScheme: 'pkcs1' })
    const { n } = rsa.exportKey('components-public-pem')
    return {
      privateKey,
      publicKey: `<RSAKeyValue><Modulus>${n.toString(
        'base64'
      )}</Modulus><Exponent>AQAB</Exponent></RSAKeyValue> `, // eslint-disable-line max-len
    }
  } catch (error) {
    return { publicKey: 'error', privateKey: 'error' }
  }
}
