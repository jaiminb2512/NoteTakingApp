import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiResponseUtil {
  /**
   * Send a successful response
   */
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response<ApiResponse<T>> {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      statusCode
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    message: string = 'Error occurred',
    statusCode: number = 500,
    error?: string
  ): Response<ApiResponse> {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      statusCode
    };
    
    return res.status(statusCode).json(response);
  }

  /**
   * Send a paginated response
   */
  static paginated<T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Data retrieved successfully'
  ): Response<PaginatedResponse<T>> {
    const totalPages = Math.ceil(total / limit);
    
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      statusCode: 200,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
    
    return res.status(200).json(response);
  }

  /**
   * Send a created response
   */
  static created<T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response<ApiResponse<T>> {
    return this.success(res, data, message, 201);
  }

  /**
   * Send a no content response
   */
  static noContent(res: Response): Response {
    return res.status(204).send();
  }

  /**
   * Send a bad request response
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 400, error);
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 401, error);
  }

  /**
   * Send a forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 403, error);
  }

  /**
   * Send a not found response
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 404, error);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 422, error);
  }

  /**
   * Send an internal server error response
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
    error?: string
  ): Response<ApiResponse> {
    return this.error(res, message, 500, error);
  }
}

export default ApiResponseUtil;
