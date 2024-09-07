import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global';
var PublicationService = /** @class */ (function () {
    function PublicationService(_http) {
        this._http = _http;
        this.url = GLOBAL.url;
    }
    PublicationService.prototype.addPublication = function (token, publication) {
        var params = JSON.stringify(publication);
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.put(this.url + 'publication', params, { headers: headers });
    };
    PublicationService.prototype.getPublications = function (token, page) {
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'publications/' + page, { headers: headers });
    };
    PublicationService.prototype.getPublicationsUser = function (token, user_id, page) {
        if (page === void 0) { page = 1; }
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.get(this.url + 'publications-user/' + user_id + '/' + page, { headers: headers });
    };
    PublicationService.prototype.deletePublication = function (token, id) {
        var headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', token);
        return this._http.delete(this.url + 'delete-publication/' + id, { headers: headers });
    };
    PublicationService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient])
    ], PublicationService);
    return PublicationService;
}());
export { PublicationService };
//# sourceMappingURL=publication.service.js.map