import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";

/**
 * filter to handle http exceptions and format the response
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  
  /**
   * catches the exception and customizes the response format
   * @param exception - the caught http exception
   * @param host - the arguments host containing context information
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // switch to http context
    const response = ctx.getResponse<Response>(); // get the http response object
    const request = ctx.getRequest<Request>(); // get the http request object
    const status = exception.getStatus(); // get the status code from the exception

    // send the customized response as json
    response.status(status).json({
      message: exception.message, // the exception message
      error: exception.message, // detailed error message
      statusCode: status, // http status code
      timestamp: new Date().toISOString(), // the time of the exception
      path: request.url, // the request path
    });
  }
}
