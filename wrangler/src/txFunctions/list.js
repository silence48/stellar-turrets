import { response } from "cfw-easy-utils";
import { TurretErrorHandler } from "../@utils/parse";
/**
 * @function GetTxFunctionList()
 * @description - constructs and returns a ordered list of txfunctions, and txfunction signer public keys as a json response
 * @export
 * @param {IncomingRequestCfProperties} { request, env }
 * @return {Promise<Response>} returns a json Response Promise object with the ordered list of txfunctions, and txfunction signer public keys as a json response to the end user
 */
export default async function GetTxFunctionList({ request, env }) {
  try {
    const { TX_FUNCTIONS } = env;

    const url = new URL(request.url);
    const query = Object.fromEntries(url.searchParams.entries());
    const { limit, cursor: c } = query;

    let { list_complete, cursor, keys } = await TX_FUNCTIONS.list({
      limit,
      cursor: c,
    });

    keys = keys.map(({ name, metadata: { txFunctionSignerPublicKey } }) => ({
      hash: name,
      signer: txFunctionSignerPublicKey,
    }));

    return response.json(
      {
        list_complete,
        cursor,
        keys,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (err) {
    return new TurretErrorHandler(
      {
        message:
          "an error occurred while retrieving the TxFunction list, check the input and try again",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
