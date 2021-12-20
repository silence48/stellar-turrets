import { response } from 'cfw-easy-utils'
import shajs from 'sha.js'
import BigNumber from 'bignumber.js'
import { Keypair, Transaction, Networks } from 'stellar-base'
import { processFeePayment } from '../@utils/stellar-sdk-utils'

export default async ({ request, env }) => {
  const { TX_FUNCTIONS, TURRET_ADDRESS, UPLOAD_DIVISOR, STELLAR_NETWORK, AUTH_REQUIRED, ALLOWED } = env
  const body = await request.formData()

  const txFunctionFields = body.get('txFunctionFields')
  const txFunctionFieldsBuffer = txFunctionFields ? Buffer.from(txFunctionFields, 'base64') : Buffer.alloc(0)

  // Test to ensure txFunctionFields is valid JSON
  if (txFunctionFields)
    JSON.parse(txFunctionFieldsBuffer.toString())

  const txFunction = body.get('txFunction')
  const txFunctionBuffer = Buffer.from(txFunction)

  const txFunctionConcat = Buffer.concat([txFunctionBuffer, txFunctionFieldsBuffer])
  const txFunctionHash = shajs('sha256').update(txFunctionConcat).digest('hex')
  const cost = new BigNumber(txFunctionConcat.length).dividedBy(UPLOAD_DIVISOR).toFixed(7)
  const txFunctionExists = await TX_FUNCTIONS.get(txFunctionHash, 'arrayBuffer')

  if (txFunctionExists)
    throw `txFunction ${txFunctionHash} has already been uploaded to this turret`

  try {
    const txFunctionFee = body.get('txFunctionFee')
    const transaction = new Transaction(txFunctionFee, Networks[STELLAR_NETWORK])
    const op = transaction.operations[0];
    try{
      op.type === 'payment'
      op.destination === TURRET_ADDRESS
      op.asset.isNative()
    } catch (err) {
        throw { status: 500, message: `Fee xdr must be a payment, to the turret fee address, in native xlm.`}    
      }
    } catch(err){
      throw { status: 500, message: `Check the included function fee, it is not valid, try again.`}
    }
    try {
      op.amount <= cost
    } catch (err){
        throw { status: 500, message: `the fee is less than the cost of ${cost}` }
    }
  // todo: add a return to return the extra fee funds
  if (
    AUTH_REQUIRED === 'true'
    && await ALLOWED.get(txFunctionHash) === null
  ) throw `txFunction ${txFunctionHash} is not allowed on this turret`

  const txFunctionSignerKeypair = Keypair.random()
  const txFunctionSignerSecret = txFunctionSignerKeypair.secret()
  const txFunctionSignerPublicKey = txFunctionSignerKeypair.publicKey()


  let transactionHash
  try {
    await processFeePayment(env, txFunctionFee, cost)
  } catch (err) {
    return response.json({
      message: typeof err.message === 'string' ? err.message : 'Failed to process txFunctionFee',
      status: 402,
      turret: TURRET_ADDRESS,
      cost,
    }, {
      status: 402
    })
}

  await TX_FUNCTIONS.put(txFunctionHash, txFunctionConcat, {metadata: {
    cost,
    payment: transactionHash,
    length: txFunctionBuffer.length,
    txFunctionSignerSecret,
    txFunctionSignerPublicKey,
  }})

  return response.json({
    hash: txFunctionHash,
    signer: txFunctionSignerPublicKey,
  })
}