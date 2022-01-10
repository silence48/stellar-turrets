//TypeScript Version 3.5.4
///// <reference path="../../node_modules/stellar-base/types/index.d.ts" />
///// <reference types="stellar-base" />
// Type definitions for Stellar Turrets
// Project: Stellar Turrets API - cf workers
// Definitions by: [Silence] <[https://github.com/silence48]>

import { Account, Networks, xdr } from "stellar-base";
import { Params } from "tiny-request-router";
import { URL } from "url";

export as namespace TurretAPI;

export interface globalEnv {
    "HORIZON_URL": string //"https://horizon-testnet.stellar.org"
    "META": KVNamespace //{}
    "RUN_DIVISOR": number //"1000000"
    "STELLAR_NETWORK": string //"TESTNET",
    "TURRET_ADDRESS": string //"GAWFB46XRA6GKIYL6CDX7PPI5XIF5KDC44HZLQRSSHTTA2J2ELMQEEWC",
    "TURRET_RUN_URL": string //"lambdadomain.execute-api.us-east-1.amazonaws.com",
    "TURRET_SIGNER": string //"",
    "TX_FEES": DurableObjectNamespace //{},
    "TX_FUNCTIONS": KVNamespace //{},
    "UPLOAD_DIVISOR": number //"1000",
    "XLM_FEE_MAX": number //"10",
    "XLM_FEE_MIN": number //"1"
    "UPLOAD_AUTH_REQ": boolean //false
    "ALLOWED": KVNamespace
}
//export as namespace globalEnv

/*~ You can declare properties of the module using const, let, or var */
export const myField: number;
type DefaultRoute = (env: globalEnv) =>Promise <Response>
export type RoutemHandler = (route: {request?: Request, params?: Params, env: globalEnv})  => Promise<Response>

export type Handler1 = ({env}: {env: globalEnv}) => Promise<Response>
export type Handler2 = ({request, env}: {request: Request, env: globalEnv}) => Promise<Response>
export type Handler3 = ({params, env}: {params: Params, env: globalEnv}) => Promise<Response>
export type Handler4 = ({request, params, env}: {request: Request, params: Params, env: globalEnv}) => Promise<Response>
export type RouteMatch2 = ({cache, request, params, env, ctx}: {cache?: Cache, request?: Request, params?: Params, env: globalEnv, ctx?: ExecutionContext}) => Promise<Response>
export type RouteHandler1 = ({request, params, env}: {request?: Request, params?: Params, env: globalEnv}) => Promise<Response>
export type RouteHandler2 = RouteHandler1 | RouteMatch2 

}
export type Handler7 = ( req: HandlerRequest ) => Promise<Response> | Response;

type networkString = keyof typeof Networks

export class txAuthToken extends xdr.TransactionEnvelope{

}

export class txFuntionMetaData{

}