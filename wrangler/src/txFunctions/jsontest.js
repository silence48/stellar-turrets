import { response } from 'cfw-easy-utils'
import shajs from 'sha.js'
import BigNumber from 'bignumber.js'
import { Keypair } from 'stellar-base'
import { processFeePayment } from '../@utils/stellar-sdk-utils'
import { buffer } from 'stream/consumers'


export default async ({ request, env }) => {
  console.log('here is the request and env from the jsontest function')
  console.log(request)
  console.log(env)
  

  const { TX_FUNCTIONS, TURRET_ADDRESS, UPLOAD_DIVISOR, STELLAR_NETWORK, ALLOWED } = env
  
  const body = await request.formData()
  console.log('the body is')
  console.log(body.get('txFunctionFields'))
  const testbuffer = Buffer.from(body.get('txFunctionFields'), 'base64')
  console.log(testbuffer)
  console.log(testbuffer.toString())
  const Parsedtest = testbuffer.toString()
  console.log(Parsedtest)
  console.log(JSON.parse(Parsedtest))
  const txFunctionFields = body.get('txFunctionFields')
    //console.log('the function fields are')
    //console.log(txFunctionFields)
  let txFunctionFieldsBuffer = Buffer.alloc(0)
  if(txFunctionFields){
    txFunctionFieldsBuffer = Buffer.from(txFunctionFields, 'base64')
  }
  
    //const testfieldsbuffer
    //console.log(txFunctionFieldsBuffer)
    // Test to ensure txFunctionFields is valid JSON
  const buffertext = txFunctionFieldsBuffer.toString()
  if (txFunctionFields){
    let jsontest = JSON.parse(buffertext)
    console.log(jsontest)
  }
console.log('SUCCESS ASSHOLE')
/*
  const txFunction = body.get('txFunction')
  const txFunctionBuffer = Buffer.from(txFunction)

  const txFunctionConcat = Buffer.concat([txFunctionBuffer, txFunctionFieldsBuffer])
  const txFunctionHash = shajs('sha256').update(txFunctionConcat).digest('hex')
  console.log(txFunctionHash)
  
  const txFunctionExists = await TX_FUNCTIONS.get(txFunctionHash, 'arrayBuffer')
  if (txFunctionExists)
    throw `txFunction ${txFunctionHash} has already been uploaded to this turret`

  if (
    STELLAR_NETWORK === 'PUBLIC'
    && await ALLOWED.get(txFunctionHash) === null
  ) throw `txFunction ${txFunctionHash} is not allowed on this turret`

  const txFunctionSignerKeypair = Keypair.random()
  //console.log('keypair is')
  //console.log(txFunctionSignerKeypair)
  const txFunctionSignerSecret = txFunctionSignerKeypair.secret()
  const txFunctionSignerPublicKey = txFunctionSignerKeypair.publicKey()

  const cost = new BigNumber(txFunctionConcat.length).dividedBy(UPLOAD_DIVISOR).toFixed(7)

  let transactionHash

  try {
    const txFunctionFee = body.get('txFunctionFee')

    // throws if payment fails
    await processFeePayment(env, txFunctionFee, cost);

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
*/
  return response.json({
    hash: txFunctionFieldsBuffer.toString(),
  })
}