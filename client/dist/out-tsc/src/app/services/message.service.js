import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
var MessageService = /** @class */ (function () {
    function MessageService(_http) {
        this._http = _http;
        this.url = GLOBAL.url;
    }
    MessageService.prototype.addMessage = function (token, message) {
        var params = JSON.stringify(message);
        var headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);
        return this._http.post(this.url + 'message', params, { headers: headers });
    };
    MessageService.prototype.getReceivedMessage = function (token, page) {
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);
        return this._http.get(this.url + 'get-received-messages/' + page, { headers: headers });
    };
    MessageService.prototype.getEmitMessage = function (token, page) {
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set("Content-Type", "application/json")
            .set("Authorization", token);
        return this._http.get(this.url + 'get-emit-messages/' + page, { headers: headers });
    };
    MessageService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], MessageService);
    return MessageService;
}());
export { MessageService };
//# sourceMappingURL=message.service.js.map