class ApiError extends Error {
  statusCode: number;
  success: boolean;
  data: unknown;

  constructor(
    statusCode: number,
    message: string,
    success = false,
    data: unknown = null,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.success = success;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }
}

export { ApiError };
