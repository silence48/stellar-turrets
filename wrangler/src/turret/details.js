import { response } from "cfw-easy-utils";
import { TurretErrorHandler } from "../@utils/parse";

export default function handleDetails({ env }) {
  try {
    const {
      TURRET_ADDRESS,
      STELLAR_NETWORK,
      HORIZON_URL,
      TURRET_RUN_URL,
      XLM_FEE_MIN,
      XLM_FEE_MAX,
      UPLOAD_DIVISOR,
      RUN_DIVISOR,
    } = env;
    /** used to initalize miniflare KV storage. */
    /*if (globalThis.MINIFLARE) {  
      await env.META.put("TEST", "TESTST");
    }*/

    const returnData = [
      {
        turret: TURRET_ADDRESS,
        network: STELLAR_NETWORK,
        horizon: HORIZON_URL,
        runner: TURRET_RUN_URL,
        version: VERSION,
        fee: {
          min: XLM_FEE_MIN,
          max: XLM_FEE_MAX,
        },
        divisor: {
          upload: UPLOAD_DIVISOR,
          run: RUN_DIVISOR,
        },
      },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // 5 minutes
        },
      },
    ];

    return response.json(returnData);
  } catch (err) {
    return new TurretErrorHandler(
      {
        message:
          "an error occurred while retrieving the turret details, try again or contact admin.",
        statuscode: 404,
      },
      404,
      err
    ).logCodeError(err);
  }
}
