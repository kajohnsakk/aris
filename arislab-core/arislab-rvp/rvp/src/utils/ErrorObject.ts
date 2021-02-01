/**
 * Created by root on 22/07/15.
 */
export interface ErrorJson{
    message: string, error_code: number, http_status:number
}
export class ErrorObject extends Error{
    public static BAD_REQUEST = new ErrorObject(
        "Bad request",400, 1002
    );
    public static INTERNAL_ERROR = new ErrorObject(
        "Internal Server Error",500, 1003
    );
    public static BAD_QUERY = new ErrorObject(
        "Bad query information",422, 1004
    );
    public static INVALID_EMAIL = new ErrorObject(
        "Invalid email",404, 1101
    );
    public static INVALID_PASSWORD = new ErrorObject(
        "Invalid password",401, 1102
    );
    public static INVALID_CURRENT_PASSWORD = new ErrorObject(
        "Wrong current password",404, 1102
    );
    public static INVALID_CREDENTIAL = new ErrorObject(
        "Invalid email or password",401, 1102
    );
    public static ACCOUNT_LOCKED = new ErrorObject(
        "Account has been locked. Please contact your administrator.",
        423,
        1002
    );
    public static RESOURCE_NOT_FOUND = new ErrorObject(
        "Resource not found",404, 1201
    );
    public static UNAUTHORIZED = new ErrorObject(
        "Unauthorized access to API ",403, 1301
    );
    public static UNAUTHENTICATED = new ErrorObject(
        "Unauthenticated access to API ",401, 1301
    );
    public statusCode : number;
    public errorCode: number;
    public constructor(message : string, statusCode: number, errorCode? : number){
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode || statusCode;
    }
    public send(res: any, message?: any){
        res.status(this.statusCode);
        res.json({
            message: message || this.toString(),
        });
    }
    public toString(){
        return this.message || "Error "+this.errorCode;
    }
};