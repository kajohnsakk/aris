export default (
  res: any,
  statusCode: number,
  message: string,
  details?: any
) => {
  const TYPES: any = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    409: "Conflict",
    500: "InternalServerError",
  };

  const responseMsg: any = {
    statusCode,
    name: TYPES[statusCode],
    message,
  };

  if (details) responseMsg.details = details;

  return res.status(statusCode).send(responseMsg);
};
