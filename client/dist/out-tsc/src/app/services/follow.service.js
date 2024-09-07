import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
var FollowService = /** @class */ (function () {
    function FollowService(_http) {
        this._http = _http;
        this.url = GLOBAL.url;
    }
    FollowService.prototype.addFollow = function (token, follow) {
        var params = JSON.stringify(follow);
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.post(this.url + 'follow', params, { headers: headers });
    };
    FollowService.prototype.deleteFollow = function (token, userId) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.delete(this.url + 'unfollow/' + userId, { headers: headers });
    };
    FollowService.prototype.getFollowing = function (token, userId, page) {
        if (userId === void 0) { userId = null; }
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        var url = this.url + 'following/';
        if (userId != null) {
            url = this.url + 'following/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    };
    FollowService.prototype.getFollowed = function (token, userId, page) {
        if (userId === void 0) { userId = null; }
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        var url = this.url + 'followed/';
        if (userId != null) {
            url = this.url + 'followed/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    };
    FollowService.prototype.getMyFollows = function (token) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'get-follows/' + true, { headers: headers });
    };
    FollowService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], FollowService);
    return FollowService;
}());
export { FollowService };
//# sourceMappingURL=follow.service.js.map