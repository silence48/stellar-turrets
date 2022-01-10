import { response } from "cfw-easy-utils";
import { processFeePayment } from "../@utils/stellar-sdk-utils";
import { handleResponse } from "../@utils/fetch";
import { TurretErrorHandler } from "../@utils/parse";

export default async function payTxFeeHandler({ request, params, env }) {
  try {
    const { TX_FEES, XLM_FEE_MIN, XLM_FEE_MAX } = env;
    const { publicKey } = params;

    const body = await request.json();
    const { txFunctionFee: feePaymentXdr } = body;

    const txFeesId = TX_FEES.idFromName(publicKey);
    const txFeesStub = TX_FEES.get(txFeesId);

    const { hash: paymentHash, amount: paymentAmount } =
      await processFeePayment(env, feePaymentXdr, XLM_FEE_MIN, XLM_FEE_MAX);

    const { lastModifiedTime, balance } = await txFeesStub
      .fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plus: paymentAmount,
        }),
      })
      .then(handleResponse);

    return response.json({
      publicKey,
      paymentHash,
      lastModifiedTime,
      balance,
    });
  } catch (err) {
    return new TurretErrorHandler(
      {
        message:
          "an error occred while depositing your txfee, please validate and try again.",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
