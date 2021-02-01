import Axios from "axios";
var FormData = require('form-data');

export class ApiService {
    public readonly apiserverEndpoint: string = `http://localhost:${process.env.API_PORT || 1780}/api`;
    private static mProxy = new ApiService();
    
    static getInstance(): ApiService {
        return ApiService.mProxy;
    }

    public getFileUploadEndpoint() {
        return this.apiserverEndpoint + "/files";
    }
	
	public getFilePathUploadEndpoint() {
        return this.apiserverEndpoint + "/files/path";
    }

    public uploadFile(file: any, uploadProgressCallback: (progress: number) => void) {
        const data = new FormData();
        data.append('file', file);

        return Axios.post(this.getFileUploadEndpoint(), data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cache-Control': 'no-cache'
            },
            onUploadProgress: (progressEvent) => {
                // console.log("P:", progressEvent);
                uploadProgressCallback(
                    Math.min(99, Math.round(progressEvent.loaded / progressEvent.total * 100))
                );
            }
        }).then((response) => {
            // console.log('upload file response is ' , response);
            return response.data.link as string;
        });
    }
	
	public uploadFileFromPath(directory: string, filePath: string, mimeType: string) {
        let data = {
            directory: directory,
            filePath: filePath,
            mimeType: mimeType
        };

        return Axios.post(this.getFilePathUploadEndpoint(), data).then((response) => {
            // console.log('upload file response is ' , response);
            return response.data.link as string;
        });
    }

}