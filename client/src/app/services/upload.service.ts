import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
    public url: string;

    constructor() {
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const formData: FormData = new FormData();
            const xhr = new XMLHttpRequest();

            for (const file of files) {
                formData.append(name, file, file.name);
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    } else {
                        reject(xhr.responseText);
                    }
                }
            };

            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}
