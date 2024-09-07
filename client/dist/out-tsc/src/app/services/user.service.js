import { __decorate, __metadata } from "tslib";
//The services will be Injectable in other classes
import { Injectable } from '@angular/core';
//Http client and headers are required to make the API REST request
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
var UserService = /** @class */ (function () {
    function UserService(_http) {
        this._http = _http;
        this.url = GLOBAL.url;
    }
    UserService.prototype.getUserImage = function (fileName) {
        var headers = new HttpHeaders().set('Authorization', this.getToken());
        return this._http.get("".concat(this.url, "get-image-user/").concat(fileName), { headers: headers, responseType: 'blob' });
    };
    UserService.prototype.getImage = function (userId) {
        var headers = new HttpHeaders().set('Authorization', this.getToken());
        return this._http.get("".concat(this.url, "get-image-user/").concat(userId), { headers: headers, responseType: 'blob' });
    };
    //The output of Observable<any> in case the rersponse from the server is different from the model of the client, any type of data
    UserService.prototype.register = function (user) {
        var params = JSON.stringify(user);
        //Specify the content type of the request to the server, in this case JSON
        var headers = new HttpHeaders().set('Content-Type', 'application/json');
        //The http client request is formed by the API method URL, the parameters and headers. Is a POST request
        return this._http.post(this.url + 'register', params, { headers: headers });
    };
    UserService.prototype.signup = function (user, gettoken) {
        if (gettoken === void 0) { gettoken = null; }
        if (gettoken != null) {
            user = Object.assign(user, { gettoken: gettoken });
        }
        var params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'login', params, { headers: headers });
    };
    UserService.prototype.getIdentity = function () {
        var identity = JSON.parse(localStorage.getItem('identity'));
        if (identity != undefined) {
            this.identity = identity;
        }
        else {
            this.identity = null;
        }
        return this.identity;
    };
    UserService.prototype.getToken = function () {
        var token = localStorage.getItem('token');
        if (token != undefined) {
            this.token = token;
        }
        else {
            this.token = null;
        }
        return this.token;
    };
    UserService.prototype.getStats = function () {
        var stats = JSON.parse(localStorage.getItem('stats'));
        if (stats != "undefined") {
            this.stats = stats;
        }
        else {
            this.stats = null;
        }
        return this.stats;
    };
    UserService.prototype.getCounters = function (userId) {
        if (userId === void 0) { userId = null; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        if (userId != null) {
            return this._http.get(this.url + 'counters/' + userId, { headers: headers });
        }
        else {
            return this._http.get(this.url + 'counters', { headers: headers });
        }
    };
    UserService.prototype.updateUser = function (user) {
        var params = JSON.stringify(user);
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        return this._http.put(this.url + 'update-user/' + user._id, params, { headers: headers });
    };
    UserService.prototype.getUsers = function (page) {
        if (page === void 0) { page = null; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        return this._http.get(this.url + 'users/' + page, { headers: headers });
    };
    UserService.prototype.getUser = function (id) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', this.getToken());
        return this._http.get(this.url + 'user/' + id, { headers: headers });
    };
    UserService.prototype.forgotPassword = function (email) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'forgot-password', { email: email }, { headers: headers });
    };
    UserService.prototype.resetPassword = function (email, token, newPassword) {
        var params = {
            email: email,
            token: token,
            "password": newPassword
        };
        var headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url + 'reset-password', params, { headers: headers });
    };
    UserService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], UserService);
    return UserService;
}());
export { UserService };
//# sourceMappingURL=user.service.js.map