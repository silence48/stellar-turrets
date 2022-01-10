import { response } from "cfw-easy-utils";
import { TurretErrorHandler } from "../@utils/parse";

/**
 * @function GetTxFunctionDetails()
 * @description Get's the requested txfunction from the key-value store and returns it's code and txfunctionfields to the user in a json Response object.
 *
 * @export
 * @param {{params: Params, env: globalEnv}} { params, env } - The object that encapsulates the incoming Request, Params, Env
 *
 * @return { Promise<Response> } Returns a json Response object that encloses the requested txfunctionhash
 */
export default async function GetTxFunctionDetails({ params, env }) {
  try {
    const { TX_FUNCTIONS } = env;
    const { txFunctionHash } = params;

    const { value, metadata } = await TX_FUNCTIONS.getWithMetadata(
      txFunctionHash,
      "arrayBuffer"
    );

    if (!value)
      throw {
        status: 404,
        message: `txFunction could not be found this turret`,
      };

    const { length, txFunctionSignerPublicKey } = metadata;

    const txFunctionBuffer = Buffer.from(value);
    const txFunction = txFunctionBuffer.slice(0, length).toString();
    const txFunctionFields = JSON.parse(
      txFunctionBuffer.slice(length).toString()
    );

    return response.json(
      {
        function: txFunction,
        fields: txFunctionFields,
        signer: txFunctionSignerPublicKey,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=2419200", // 28 days
        },
      }
    );
  } catch (err) {
    return new TurretErrorHandler(
      {
        message:
          "an error occurred while retrieving the TxFunctionDetails, check the input and try again",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
