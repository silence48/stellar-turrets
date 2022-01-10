import { response } from 'cfw-easy-utils'
import { authTxToken } from '../@utils/auth'
import { handleResponse } from '../@utils/fetch'

export default async ({ request, env }) => {
  const { TX_FEES, STELLAR_NETWORK } = env

  const feeToken = request.headers.get('authorization')?.split(' ')?.[1]

  const { 
    hash: authedHash,
    publicKey: authedPublicKey, 
    data: authedContracts,
    singleUse,
  } = authTxToken(STELLAR_NETWORK, feeToken)

  const txFeesId = TX_FEES.idFromName(authedPublicKey)
  const txFeesStub = TX_FEES.get(txFeesId)

  const feeMetadata = await txFeesStub.fetch('/').then(handleResponse)

  if (!feeMetadata)
    throw {status: 404, message: `Fee balance could not be found this turret` }

  return response.json({
    hash: authedHash,
    publicKey: authedPublicKey,
    lastModifiedTime: feeMetadata.lastModifiedTime,
    balance: feeMetadata.balance,
    txFunctionHashes: authedContracts,
    singleUse
  }, {
    headers: {
      'Cache-Control': 'public, max-age=5',
    }
  })
}

