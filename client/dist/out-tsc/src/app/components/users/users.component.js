import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
var UsersComponent = /** @class */ (function () {
    function UsersComponent(_route, _router, _userService, _followService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._followService = _followService;
        this.title = 'People';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
    UsersComponent.prototype.ngOnInit = function () {
        console.log('Users Component Working...');
        this.actualPage();
    };
    UsersComponent.prototype.actualPage = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var page;
            if (!params['page'])
                page = 1;
            else
                page = +params['page'];
            _this.page = page;
            _this.next_page = page + 1;
            _this.prev_page = page - 1;
            if (_this.prev_page <= 0) {
                _this.prev_page = 1;
            }
            //Get Users List
            _this.getUsers(page);
        });
    };
    UsersComponent.prototype.getUsers = function (page) {
        var _this = this;
        this._userService.getUsers(page).subscribe(function (response) {
            if (!response.users) {
                _this.status = 'error';
            }
            else {
                _this.total = response.total;
                _this.users = response.users;
                _this.pages = response.pages;
                _this.follows = response.users_following;
                console.log(_this.follows);
                if (page > _this.pages) {
                    _this._router.navigate(['/people', 1]);
                }
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status == 'error';
            }
        });
    };
    UsersComponent.prototype.mouseEnter = function (user_id) {
        this.followUserOver = user_id;
    };
    UsersComponent.prototype.mouseLeave = function (user_id) {
        this.followUserOver = 0;
    };
    UsersComponent.prototype.followUser = function (followed) {
        var _this = this;
        var follow = new Follow('', this.identity._id, followed);
        this._followService.addFollow(this.token, follow).subscribe(function (response) {
            if (!response.follow) {
                _this.status = 'error';
            }
            else {
                _this.status = 'success';
                _this.follows.push(followed);
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status == 'error';
            }
        });
    };
    UsersComponent.prototype.unfollowUser = function (followed) {
        var _this = this;
        this._followService.deleteFollow(this.token, followed).subscribe(function (response) {
            var search = _this.follows.indexOf(followed);
            if (search
                != -1) {
                _this.follows.splice(search, 1);
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status == 'error';
            }
        });
    };
    UsersComponent = __decorate([
        Component({
            selector: 'users',
            templateUrl: './users.component.html',
            styleUrls: ['./users.component.css'],
            providers: [UserService, FollowService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            FollowService])
    ], UsersComponent);
    return UsersComponent;
}());
export { UsersComponent };
//# sourceMappingURL=users.component.js.map