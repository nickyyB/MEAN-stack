import * as console from 'console';
import { NextFunction, Request, Response } from 'express';

function loggerMiddleware(request: Request, response: Response, next: NextFunction) {
  console.log(`${request.method} ${request.path}`);
  console.log('Request Body:', JSON.stringify(request.body));
  console.log('Request Params:', JSON.stringify(request.params));
  console.log('Request Query:', JSON.stringify(request.query));
  next();
}

export default loggerMiddleware;
