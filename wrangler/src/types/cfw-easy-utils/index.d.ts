// Type definitions for cfw-easy-utils
// Project: Stellar Turrets API - cf workers
// Definitions by: [Silence] <[https://github.com/silence48]>

declare module 'cfw-easy-utils'{
    export namespace response {
        let version: string
        export { version }
        export namespace config {
            const secretKey: string
            const debugHeaders: boolean
        }
        export namespace accessControl {
            const allowOrigin: string
            const allowMethods: string
            const allowHeaders: string
        }
        export const request: Request
        export function _corsHeaders(): {
            'Access-Control-Allow-Origin': string
            'Access-Control-Allow-Methods': string
            'Access-Control-Max-Age': string
        }

        export function injectCors(response: Response, options: Object): void
        
        export function _genericResponse(mimetype: string, body: string, options: Object): Promise<Response>
        
        export function cors(request: Request): Response
        
        export function json(stringOrObject: string | object, options?: Object): Promise<Response>
        
        export function html(body: string, options: Object): Promise<Response>
        
        export function text(body: any, options?: Object): Promise<Response>
        
        export function fromResponse(resp: Response, options: Object): Promise<Response>
        
        export function _static(request: Request, options: Object): Promise<Response>
        
        export { _static as static }
        
        export function websocket(socket: WebSocket): Promise<Response>

        export function setHeader(response: Response, key: any, value: any): Response

        export function headersToObject(headers: Headers): any

    }}
//export {}
