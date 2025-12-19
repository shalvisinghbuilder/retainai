import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    let statusCode: number;
    let errorCode: string;
    let message: string;
    
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        errorCode = (exceptionResponse as any).errorCode || 'HTTP_EXCEPTION';
        message = (exceptionResponse as any).message || exception.message;
      } else {
        errorCode = 'HTTP_EXCEPTION';
        message = String(exceptionResponse);
      }
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = 'INTERNAL_ERROR';
      message = 'An unexpected error occurred';
    }
    
    const errorResponse = {
      statusCode,
      errorCode,
      message,
      timestamp: new Date().toISOString(),
    };
    
    response.status(statusCode).json(errorResponse);
  }
}

