import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from '../../../models/message';
import { FollowService } from '../../../services/follow.service';
import { MessageService } from '../../../services/message.service';
import { UserService } from '../../../services/user.service';
import { GLOBAL } from '../../../services/global';
import { ToastrService } from 'ngx-toastr';
var AddComponent = /** @class */ (function () {
    function AddComponent(_route, _router, _followService, _messageService, _userService, toastr) {
        this._route = _route;
        this._router = _router;
        this._followService = _followService;
        this._messageService = _messageService;
        this._userService = _userService;
        this.toastr = toastr;
        this.title = "Send Message";
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message('', '', '', '', this.identity._id, '');
        this.loading = true;
    }
    AddComponent.prototype.ngOnInit = function () {
        console.log("Messages Add Component Working...");
        this.loading = false;
        this.getMyFollows();
    };
    AddComponent.prototype.onSubmit = function (form) {
        var _this = this;
        this.loading = true;
        this._messageService.addMessage(this.token, this.message).subscribe(function (response) {
            if (response.message) {
                //this.status = 'success';
                _this.loading = false;
                _this.toastr.success('Message Sent Successfully.');
                form.reset();
            }
        }, function (error) {
            console.log(error);
            //var errorMessage = <any>error;
            /*if(errorMessage != null){
                this.status = 'error';
            }*/
            _this.loading = false;
            _this.toastr.error('Fail to send the message. Try again.');
        });
    };
    AddComponent.prototype.getMyFollows = function () {
        var _this = this;
        this._followService.getMyFollows(this.token).subscribe(function (response) {
            _this.follows = response.follows;
        }, function (error) {
            console.log(error);
        });
    };
    AddComponent = __decorate([
        Component({
            selector: 'add',
            templateUrl: './add.component.html',
            styleUrls: ['./add.component.css'],
            providers: [
                FollowService,
                MessageService,
                UserService,
                ToastrService
            ]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            FollowService,
            MessageService,
            UserService,
            ToastrService])
    ], AddComponent);
    return AddComponent;
}());
export { AddComponent };
//# sourceMappingURL=add.component.js.map