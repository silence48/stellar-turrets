import { response } from "cfw-easy-utils";
import shajs from "sha.js";
import BigNumber from "bignumber.js";
import { Keypair } from "stellar-base";
import { processFeePayment } from "../@utils/stellar-sdk-utils";
import { TurretErrorHandler } from "../@utils/parse";

export default async function HandleTxFuncUpload({ request, env }) {
  try {
    const {
      TX_FUNCTIONS,
      TURRET_ADDRESS,
      UPLOAD_DIVISOR,
      STELLAR_NETWORK,
      ALLOWED,
    } = env;

    const body = await request.formData();

    const txFunctionFields = body.get("txFunctionFields");

    let txFunctionFieldsBuffer;

    if (txFunctionFields) {
      txFunctionFieldsBuffer = Buffer.from(txFunctionFields, "base64");
    } else {
      txFunctionFieldsBuffer = Buffer.alloc(0);
    }

    //@todo Test to ensure txFunctionFields is valid JSON
    if (txFunctionFields) JSON.parse(txFunctionFieldsBuffer.toString());
    const txFunction = body.get("txFunction");
    const txFunctionBuffer = Buffer.from(txFunction);
    const txFunctionConcat = Buffer.concat([
      txFunctionBuffer,
      txFunctionFieldsBuffer,
    ]);
    const txFunctionHash = shajs("sha256")
      .update(txFunctionConcat)
      .digest("hex");
    const txFunctionExists = await TX_FUNCTIONS.get(
      txFunctionHash,
      "arrayBuffer"
    );
    if (txFunctionExists)
      throw `txFunction ${txFunctionHash} has already been uploaded to this turret`;
    if (
      STELLAR_NETWORK === "PUBLIC" &&
      (await ALLOWED.get(txFunctionHash)) === null
    )
      throw `txFunction ${txFunctionHash} is not allowed on this turret`;

    const txFunctionSignerKeypair = Keypair.random();

    const txFunctionSignerSecret = txFunctionSignerKeypair.secret();

    const txFunctionSignerPublicKey = txFunctionSignerKeypair.publicKey();

    const cost = new BigNumber(txFunctionConcat.length)
      .dividedBy(UPLOAD_DIVISOR)
      .toFixed(7);

    let transactionHash;

    try {
      const txFunctionFee = body.get("txFunctionFee");

      // throws if payment fails
      let reserve = cost;
      await processFeePayment(env, txFunctionFee, cost, reserve);
    } catch (err) {
      return response.json(
        {
          message:
            typeof err.message === "string"
              ? err.message
              : "Failed to process txFunctionFee you must include a valid tx to pay the upload fee",
          status: 402,
          turret: TURRET_ADDRESS,
          cost,
        },
        {
          status: 402,
        }
      );
    }
    await TX_FUNCTIONS.put(txFunctionHash, txFunctionConcat, {
      metadata: {
        cost,
        payment: transactionHash,
        length: txFunctionBuffer.length,
        txFunctionSignerSecret,
        txFunctionSignerPublicKey,
      },
    });

    return response.json({
      hash: txFunctionHash,
      signer: txFunctionSignerPublicKey,
    });
  } catch (err) {
    return new TurretErrorHandler(
      {
        message: "an error occurred while uploading the txfunction.",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
