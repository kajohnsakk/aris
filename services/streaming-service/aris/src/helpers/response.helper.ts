export interface IResponse {
  statusCode: number;
  name?: string;
  message: string;
  data?: any;
}

const response = (payload: IResponse) => {
  const { statusCode, message, data } = payload;
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

  const responseInfo: IResponse = {
    statusCode,
    name: TYPES[statusCode],
    message,
  };

  if (data) responseInfo.data = data;

  return responseInfo;
};

export default response;
