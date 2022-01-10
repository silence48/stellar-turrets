import { response } from 'cfw-easy-utils'

/**
 * @description Turret error handler class
 *
 * @export
 * @class TurretErrorHandler
 * 
 * @typedef {object} PublicErrorObj - An object with the shape {message: 'errormessage', statuscode: 'http error code'}
 * @typedef {object} PrivateErrorObj - An object that implements the Error object
 *
 * @returns {TurretErrorHandler} - returns a TurretErrorHandler, and automatically returns a response object, or an error log,
 *                                 based on the inputs given. 
 * 
 */
export class TurretErrorHandler {
  /**
   * Creates an instance of TurretErrorHandler.
   * @param {string | PublicErrorObj | undefined} err        - The error interface, can accept a string, 
   *                                                           or an object shaped like a PublicErrorObj, 
   *                                                           or will fall back to a default if undefined
   * @param {number | string | undefined}        statusCode?  - The http error statuscode you wish to pass to the end user
   * @param {Error | PrivateErrorObj }           codeErr?    - An object in the shape of an Error object, to pass syntax and
   *                                                           errors and stack traces to the logs.
   * @memberof TurretErrorHandler
   */
  constructor(err, statusCode, codeErr) {
    console.info('an error is being handled')
    
    this.defaultmsg = "There has been a server error."
    this.defaultcode = 512
    try{
    if (err === undefined && codeErr === undefined){
        console.info(`err and codeerr were undefined.`)
        this.handled = true
        // @ts-ignore
        this.returnErrorFromStatus(statusCode)
        throw('you must pass either an err as a string or public error response constructor, or a code error object or both. attempting to handle through only a code')
      }
    }catch(m){
      console.info(`syntaxerror: ${m}`)
      // @ts-ignore
      this.returnErrorError(m)
      return
    }

      if (!err && !statusCode && !codeErr){
        throw('You must pass either a public error object or a code error object.')
      }
      if (!err && codeErr){
        this.codeErrorOnly = true
        this.error = codeErr
        // @ts-ignore
        console.info(`err: ${m}`)
        this.logCodeError(codeErr)
        return
      }
      
      // @ts-ignore
      this.errStatus = statusCode ? statusCode : err.statuscode ? err.statuscode : this.defaultcode;
                        /*  ^if 1   ^if1t~        ^if1f if 2       ^if.1f,2t          ^ if 1f, 2f     */
      this.errMsg = this.defaultmsg
      try {
          // @ts-ignore
          this.isReObj = err.headers?.has('content-type') ? true : undefined;
          
          // @ts-ignore
          this.wHeaders = this.isReObj ? (err.headers.get('content-type').indexOf('json') > -1 ? err.json() : err.text()) : undefined;
          
          // @ts-ignore
          this.errMsg = (typeof err === "string") ? err : (err.message ? err.message : (this.wHeaders ? this.wHeaders : this.defaultmsg));
          
          if (statusCode && (statusCode != this.errStatus)) {
              // @ts-ignore
              this.errStatus = parseInt(statusCode).toString() === ("NaN") ? this.defaultcode : parseInt(statusCode);
              // @ts-ignore
              console.warn(`incorrect status code formatting ${this.errStatus} should be a number like 3 or "3", ${parseInt(statusCode)}, and ${parseInt(statusCode).toString()}`)
              // @ts-ignore
              this.logCodeError(new Error(`resetting default statusCode; an error occurred parsing the statuscode: ${statusCode}, this.errStatus: ${this.errStatus}, see trace for further info`, err))
              this.errStatus = this.defaultcode
            }
          // @ts-ignore
          this.error = codeErr?.stack ? codeErr : undefined;
          // @ts-ignore
          this.returnError();

      }
      catch (err) {
          console.warn(`The error handler constructor failed. String or TurretErrorObj was expected but got ${err}`)
          // @ts-ignore
          let codeerr = this.logCodeError(err)
          // @ts-ignore
          return this.returnErrorError(err)
          
      }
  }
  /**
   * @function TurretErrorHandler.returnError()
   * @description A function to return a public error to the end user.
   * 
   * @param {string | PublicErrorObj } m? - a PublicErrorObj or a String to describe your error
   * @return { Promise<Response> } - returns a json http response to the end user
   * @memberof TurretErrorHandler
   */
  returnError(m) {
      console.warn('an error was returned');
      if (m){
        console.error(m)
      }
      return response.json({
          ...(typeof this.errMsg === 'string' ? { message: this.errMsg } : this.errMsg),
          status: this.errStatus,
      }, {
          status: this.errStatus,
          headers: {
              'Cache-Control': 'no-store'
          }
      });
  }
  /**
   * @function TurretErrorHandler.returnErrorError()
   * @description - A function to handle unhandled errors
   * 
   * @param {string | PublicErrorObj } m? - a PublicErrorObj or a String to describe your error
   * @return { Promise<Response> } - returns a json http response to the end user
   * @memberof TurretErrorHandler
   */
  returnErrorError(m) {
      console.warn('an errorhandler-error was returned');
      if (m){
        console.error(m)
      }
      return response.json({status: this.defaultcode, message: this.defaultmsg}, {
          headers: {
              'Cache-Control': 'no-store'
          }
      });
  }
  //WIP
   /**
   * @function TurretErrorHandler.returnErrorFromStatus()
   * @description - A function overload for handling errors that don't pass any error objects or message, but do
   *                include a status code
   * 
   * @param { number | string } errorstatus? - a PublicErrorObj or a String to describe your error
   * @return { Promise<Response> } - returns a json http response to the end user
   * @memberof TurretErrorHandler
   */
  returnErrorFromStatus(errorstatus){
    
    console.info(`a error was handled with no message only a code of ${errorstatus}`)
    let genericmessage
    try{
      // @ts-ignore
      if (parseInt(errorstatus).toString() === ("NaN")){
        throw(`attempted to handle the error with only a statuscode, however the status code must be a number such as 100 or \"100\" and I was passed ${errorstatus}`)
      }
      let expr
      if (errorstatus <= 199 && errorstatus >= 1) expr = 100
      else if (errorstatus >= 200 && errorstatus <= 299) expr = 200
      else if (errorstatus >= 300 && errorstatus <= 399) expr = 300
      else if (errorstatus >= 400 && errorstatus <= 499) expr = 400
      else if (errorstatus >= 500 && errorstatus <= 599) expr = 500
      else expr = 0
      switch (expr) {
        case (100):
          genericmessage = "an undefined error message for a 100 series error"
          break;
        case (200):
          genericmessage = "an undefined error message for a 200 series error"
          break
        case (300):
          genericmessage = "an undefined error message for a 300 series error"
          break
        case (400):
          genericmessage = "an undefined error message for a 400 series error"
          break
        case (500) :
          genericmessage = "an undefined error message for a 500 series error"
          break
        default:
          genericmessage = "there was an undefined error"
          break;
      }
      return response.json({status: errorstatus, message: genericmessage}, {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
    }catch(err){
      console.error(err)
      // @ts-ignore
      return this.returnErrorError()
    }
    
  }

   /**
   * @function TurretErrorHandler.logCodeError()
   * @description - A function overload for handling errors that don't pass any error objects or message, but do
   *                include a status code
   * 
   * @param { number | string } codeErrorObj? - a PublicErrorObj or a String to describe your error
   * @return { Error } returns an Error object for use in logging various syntax errors and logging them to the logger
   * 
   * @memberof TurretErrorHandler
   */
  logCodeError(codeErrorObj) {
    let dmsg = "an undefined code error was logged"
    let opts = codeErrorObj ? (typeof codeErrorObj === "string") ? undefined :  codeErrorObj.options ? codeErrorObj.options : undefined  :  undefined
    /*          ^if 1t       ^if 1t, if 2                         ^if.1t,2t~   ^if.1t,2f   if 3      ^ if 1t,2f,3t~         ^if.1t,2f,3f~ if 1f      */
    let msg = codeErrorObj ? (typeof codeErrorObj === "string") ? codeErrorObj : codeErrorObj.message ? codeErrorObj.message : dmsg : dmsg
    
    // @ts-ignore
    let loaddefault = ( d, m) => {
      let pe = this.error ? 1 : 0
      let de = (d === m) ? 2 : 0
      // @ts-ignore
      let op = opts ? 4 : 0
      return pe + de  }
    switch (loaddefault(dmsg, msg)) {
      case 1:
        console.info(`no passed object passing custom error message, and a private this.error is availabale on ${this} object`)
        opts = this.error
        console.error(msg, this.error)
        break;
      case 2:
        console.info(`passing the default error message, no passed opts, no passed error, no private this.error available ${this} object`)
        opts = this.error
        console.error(msg)
        break
      case 3:
        console.info(`no custom error message, no passed opts, private this.error available ${this} object, passing default and stored error`)
        opts = this.error
        console.error(msg, this.error)
        break;
      case 4:
        console.info(`passing custom error message, passing passed opts, no private this.error available ${this} object`)
        console.error(msg, opts)
        break;
      case 5:
        console.info(`logging custom error message, and custom opts, and private this.error available ${this} object`)
        console.error(msg, opts, this.error)
        break
      case 6:
        console.info(`no error message passed, including default and passed opts, no private this.error available ${this} object`)
        console.error(msg, opts)
        break
      case 7:
        console.info(`no error message passed, including default and passed opts, and private this.error on this ${this} object`)
        console.error(msg, opts, this.error)
        break
      default:
        console.info(`no error information available. but still passing default`)
        console.error(msg)
        break
    }
      if (opts === undefined){
        opts = "no further information"
      }
      return new Error(msg, opts)
  }
}
