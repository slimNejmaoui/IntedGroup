import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { GLOBAL } from './global';
var UploadService = /** @class */ (function () {
    function UploadService() {
        this.url = GLOBAL.url;
    }
    UploadService.prototype.makeFileRequest = function (url, params, files, token, name) {
        return new Promise(function (resolve, reject) {
            var formData = new FormData();
            var xhr = new XMLHttpRequest();
            for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
                var file = files_1[_i];
                formData.append(name, file, file.name);
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }
                    else {
                        reject(xhr.responseText);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    };
    UploadService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], UploadService);
    return UploadService;
}());
export { UploadService };
//# sourceMappingURL=upload.service.js.map