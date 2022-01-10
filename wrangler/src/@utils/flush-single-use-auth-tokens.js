import { response } from 'cfw-easy-utils'
import moment from 'moment'
import { groupBy, map } from 'lodash'
import { handleResponse } from './fetch'
import Bluebird from 'bluebird'
import { TurretErrorHandler } from './parse'

export default async function flushSingleUseAuthTokens({ metadata, env, ctx }) {
  try {
    const { META, TX_FEES } = env
    const { keys } = await META.list({ prefix: 'suat:', limit: 100 })
    const allExpiredKeys = keys
      .filter(({ metadata }) => moment.utc(metadata, 'X').isBefore())
      .map(({ name }) => {
        const [, publicKey, transactionHash] = name.split(':')
        return {
          publicKey,
          transactionHash
        }
      })

    const groupedExpiredKeys = map(groupBy(allExpiredKeys, 'publicKey'), (value, key) => {
      return {
        publicKey: key,
        transactionHashes: map(value, 'transactionHash')
      }
    })

    const promiseResponse = await Bluebird.mapSeries(groupedExpiredKeys, ({ publicKey, transactionHashes }) => {
      const txFeesId = TX_FEES.idFromName(publicKey)
      const txFeesStub = TX_FEES.get(txFeesId)

      return txFeesStub.fetch(`/${publicKey}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionHashes)
      }).then(handleResponse)
    })
    return response.json(promiseResponse)
  } catch(err){
    return new TurretErrorHandler('an error occured while flushing the single use auth tokens.').returnError(err)
  }
}
