import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
var LikeService = /** @class */ (function () {
    function LikeService(_http) {
        this._http = _http;
        this.url = GLOBAL.url;
    }
    LikeService.prototype.addLike = function (token, like) {
        var params = JSON.stringify(like);
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.post(this.url + 'like', params, { headers: headers });
    };
    LikeService.prototype.checkLike = function (token, publicationId) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'like/' + publicationId, { headers: headers });
    };
    LikeService.prototype.deleteLike = function (token, publicationId) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.delete(this.url + 'delete-like/' + publicationId, { headers: headers });
    };
    LikeService.prototype.getLikes = function (token, publicationId) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'get-likes/' + publicationId, { headers: headers });
    };
    LikeService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], LikeService);
    return LikeService;
}());
export { LikeService };
//# sourceMappingURL=like.service.js.map