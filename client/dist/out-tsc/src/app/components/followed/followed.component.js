import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
var FollowedComponent = /** @class */ (function () {
    function FollowedComponent(_route, _router, _userService, _followService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._followService = _followService;
        this.title = "Following";
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }
    FollowedComponent.prototype.ngOnInit = function () {
        console.log('Followed Component Working...');
        this.actualPage();
    };
    FollowedComponent.prototype.actualPage = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var user_id = params['id'];
            _this.userPageId = user_id;
            //The '+' converts it to an integer number
            var page = +params['page'];
            _this.page = page;
            if (!params['page']) {
                page = 1;
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
            _this.getUser(user_id, page);
        });
    };
    FollowedComponent.prototype.getFollows = function (user_id, page) {
        var _this = this;
        this._followService.getFollowed(this.token, user_id, page).subscribe(function (response) {
            if (!response.follows) {
                _this.status = 'error';
            }
            else {
                _this.total = response.total;
                _this.followed = response.follows;
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
    FollowedComponent.prototype.getUser = function (userId, page) {
        var _this = this;
        this._userService.getUser(userId).subscribe(function (response) {
            if (response.user) {
                _this.user = response.user;
                _this.getFollows(userId, page);
            }
            else {
                _this._router.navigate(['/home']);
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status == 'error';
            }
        });
    };
    FollowedComponent.prototype.mouseEnter = function (user_id) {
        this.followUserOver = user_id;
    };
    FollowedComponent.prototype.mouseLeave = function (user_id) {
        this.followUserOver = 0;
    };
    FollowedComponent.prototype.followUser = function (followed) {
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
    FollowedComponent.prototype.unfollowUser = function (followed) {
        var _this = this;
        this._followService.deleteFollow(this.token, followed).subscribe(function (response) {
            var search = _this.follows.indexOf(followed);
            if (search != -1) {
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
    FollowedComponent = __decorate([
        Component({
            selector: 'followed',
            templateUrl: './followed.component.html',
            styleUrls: ['./followed.component.css'],
            providers: [UserService, FollowService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            FollowService])
    ], FollowedComponent);
    return FollowedComponent;
}());
export { FollowedComponent };
//# sourceMappingURL=followed.component.js.map