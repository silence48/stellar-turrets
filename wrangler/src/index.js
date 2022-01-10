import { Router } from "tiny-request-router";

/** Single use auth tokens are designed to only be valid for 5 minutes and thus the
 *  flushSingleUseAuthTokens module cleans out the durable object every 5 minutes through
 *  a cloudflare cron scheduler. See ExportedHandlerScheduledHandler
 */
import flushSingleUseAuthTokens from "./@utils/flush-single-use-auth-tokens";

/** The TxFees module is used for processing the fees required to utilize the
 *  turrets network.  Fees are handled on a per-turret basis and are currently stored
 *  in the cloudflare durable objects namespace.
 */
import TxFees from "./@utils/do-tx-fees";

/** The Turret modules are the modules which provide the endpoint handlers for
 *  the public - unauthenticated get requests, that return public information
 *  about the turret.
 */
import handleToml from "./turret/toml";
import handleDetails from "./turret/details";

/** the txFunctions modules handle the various aspects of uploading, listing, getting,
 *  and running txFunctions.
 */
import GetTxFunctionDetails from "./txFunctions/get";
import GetTxFunctionList from "./txFunctions/list";
import HandleTxFuncUpload from "./txFunctions/upload";
import txFunctionsRun from "./txFunctions/run";

/** The TxFees Modules handle debiting and crediting fees that are incurred through
 *  the use of the turrets services.
 */
import handleGetTxFeeBalance from "./txFees/get";
import payTxFeeHandler from "./txFees/pay";

/** The TurretErrorHandler module is used to handle errors, both public errors that require
 *  Response object to be returned to the user, as well as private errors for the turret
 *  admin which includes various levels of logging.
 */
import { TurretErrorHandler } from "./@utils/parse";

/** The Trust Modules are for handling the turret trust quorem which is used to generate
 *  the stellar.toml file, and to establish trusted signers in a turret network.
 */

//import TurretTrust from './trust'

/** The validation class is currently a WIP and is not done being refactored. */
//import ValidatorMiddleware from './@utils/validation'
//import jsontest from './txFunctions/jsontest'

const router = new Router();

/** The TurretDetails and Stellar.toml endpoints are public, and do not require auth in
 *  order to run them.
 */
router.get("/", handleDetails).get("/.well-known/stellar.toml", handleToml);

/** The tx-functions endpoints are for uploading and executing contracts.  Users may also
 *  use the get method to return a list of available txfunctions and their metadata.
 */
router
  .post("/tx-functions", HandleTxFuncUpload)
  .get("/tx-functions", GetTxFunctionList)
  .get("/tx-functions/:txFunctionHash", GetTxFunctionDetails)
  .post("/tx-functions/:txFunctionHash", txFunctionsRun);

/** the txfees endpoint is for handling the fees needed for running contracts.  Uploads
 *  require their own fee transaction, but any excess is deposited to the authed users fee
 *  account.  The minimum required deposit to run a contract is calculated by the turrets
 *  fee divisor number multiplied by the maximum amount of time the txfunction can run
 *  which defaults to
 */
router
  .get("/tx-fees", handleGetTxFeeBalance)
  .post("/tx-fees/:publicKey", payTxFeeHandler);

/** the trust endpoint is under construction and will allow for adding and removing
 *  trusted turrets, and adding and removing turrets to txfunctions.
 */
/*
router
.put('/trust/heal/:ctrlAccount', ctrlAccountsHeal)
*/

/**
 * @description Handles the incoming fetch event , Matches the route using express-like routing
 *              via the 'tiny-request-router module. Returns the response to the end user as json.
 * @template Env
 * @type ExportedHandlerFetchHandler
 * @param {Request} request the request object from cf (from the user)
 * @param {Env} env - The Env is the globalEnv of cloudflare.
 * @param {ExecutionContext} ctx - The ctx is the Execution Context
 * @returns {Promise<Response>} Promise object represents the response object.
 */
async function handleRequest(request, env, ctx) {
  try {
    const cache = caches.default;
    const { method, url } = request;
    const { href, pathname } = new URL(url);

    if (method === "OPTIONS")
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Authorization, Origin, Content-Type, Accept, Cache-Control, Pragma",
          "Access-Control-Allow-Methods":
            "GET, PUT, POST, DELETE, PATCH, OPTIONS",
          "Cache-Control": "public, max-age=2419200", // 28 days
        },
      });

    // TODO: check and re-enable cache in production

    // else if (method === 'GET') {
    //   const cacheMatch = await cache.match(href)

    //   if (cacheMatch)
    //     return cacheMatch
    // }

    ////

    // @ts-ignore
    const routerMatch = router.match(method, pathname);
    if (routerMatch) {
      const routerResponse = await routerMatch.handler({
        ...routerMatch,
        cache,
        request,
        env,
        ctx,
      });

      if (
        method === "GET" &&
        routerResponse.status >= 200 &&
        routerResponse.status <= 299
      )
        ctx.waitUntil(cache.put(href, routerResponse.clone()));

      return routerResponse;
    }
  } catch (err) {
    //console.warn('this is to handle a code error')
    //let handlePrivError = new TurretErrorHandler(null, null, newErr)
    //console.warn('this is to handle a public error and log a code error')
    //let handleDebugError = new TurretErrorHandler('There was an error handling your request', 404, err)
    //console.warn('this one is to handle a public error object')
    //let handleDebugErrorObj = new TurretErrorHandler({message: 'All your base are belong to us', status: 505}, null, null)
    //wip console.warn('this is to handle an error which is only passed a status')
    //wip let testErrorwithonlyStatus = new TurretErrorHandler(null, 304, null)
    //let logCodeError = handlePrivError.logCodeError()
    //return new TurretErrorHandler(err, 400).returnError()
    return new TurretErrorHandler(
      {
        message:
          "This server errored; please check your request, try again later, or contact admin.",
        status: 414,
      },
      414,
      err
    ).returnError(err);
  }
}
/**
 * @description Handles a scheduled event for now it is used to clear single use auth tokens every 5 minutes to prevent re-use
 * @template Env
 * @type ExportedHandlerScheduledHandler
 * @param {metadata} ScheduledController - the cron configuration
 * @param {Env} env The Env from cloudflare in the shape of GlobalEnv
 * @param {ExecutionContext} ctx The ctx is the Execution Context
 * @returns {Promise<void>} promise is void.
 */
function handleScheduled(metadata, env, ctx) {
  return Promise.all([flushSingleUseAuthTokens({ metadata, env, ctx })]);
}

/**
 * @exports TxFees
 * @exports
 */
exports.TxFees = TxFees;
exports.handlers = {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
  async scheduled(metadata, env, ctx) {
    return handleScheduled(metadata, env, ctx);
  },
};
