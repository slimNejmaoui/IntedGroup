import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
var ReceivedComponent = /** @class */ (function () {
    function ReceivedComponent(_route, _router, _followService, _messageService, _userService) {
        this._route = _route;
        this._router = _router;
        this._followService = _followService;
        this._messageService = _messageService;
        this._userService = _userService;
        this.title = 'Received messages';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.pages = 1;
        this.page = 1;
        this.loading = true;
    }
    ReceivedComponent.prototype.ngOnInit = function () {
        console.log("Messages Received Component Working...");
        this.actualPage();
    };
    ReceivedComponent.prototype.actualPage = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var page = +params['page'];
            _this.page = page;
            if (!params['page']) {
                page = 1;
                _this.page = 1;
            }
            if (!page) {
                page = 1;
            }
            else {
                _this.next_page = page + 1;
                _this.prev_page = page - 1;
                if (_this.prev_page <= 0) {
                    _this.prev_page = 1;
                }
            }
            //Get Users List
            _this.getMessages(_this.token, _this.page);
            _this.loading = false;
        });
    };
    ReceivedComponent.prototype.getMessages = function (token, page) {
        var _this = this;
        this._messageService.getReceivedMessage(token, page).subscribe(function (response) {
            if (response.messages) {
                _this.messages = response.messages;
                _this.total = response.total;
                _this.pages = response.pages;
            }
        }, function (error) {
            console.log(error);
        });
    };
    ReceivedComponent = __decorate([
        Component({
            selector: 'received',
            templateUrl: './received.component.html',
            styleUrls: ['./received.component.css'],
            providers: [
                FollowService,
                MessageService,
                UserService
            ]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            FollowService,
            MessageService,
            UserService])
    ], ReceivedComponent);
    return ReceivedComponent;
}());
export { ReceivedComponent };
//# sourceMappingURL=received.component.js.map