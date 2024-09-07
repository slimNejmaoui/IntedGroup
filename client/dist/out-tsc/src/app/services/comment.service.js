import { __decorate, __metadata } from "tslib";
// comment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
var CommentService = /** @class */ (function () {
    function CommentService(http) {
        this.http = http;
        this.apiUrl = 'http://localhost:3800/api';
    }
    CommentService.prototype.addComment = function (token, publicationId, text) {
        var headers = new HttpHeaders({
            'Authorization': "Bearer ".concat(token)
        });
        return this.http.post("".concat(this.apiUrl, "/add-comment/").concat(publicationId), { text: text }, { headers: headers });
    };
    CommentService.prototype.getComments = function (publicationId) {
        return this.http.get("".concat(this.apiUrl, "/comments/").concat(publicationId));
    };
    CommentService = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [HttpClient])
    ], CommentService);
    return CommentService;
}());
export { CommentService };
//# sourceMappingURL=comment.service.js.map