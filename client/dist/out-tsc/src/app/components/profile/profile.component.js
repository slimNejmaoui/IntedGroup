import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Follow } from '../../models/follow';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { GLOBAL } from '../../services/global';
var ProfileComponent = /** @class */ (function () {
    function ProfileComponent(_route, _router, _userService, _followService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._followService = _followService;
        this.title = 'Profile';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.following = false;
        this.followed = false;
        this.loading = true;
    }
    ProfileComponent.prototype.ngOnInit = function () {
        console.log('Profile Component Working...');
        this.loadPage();
        this.loading = false;
    };
    ProfileComponent.prototype.loadPage = function () {
        var _this = this;
        this._route.params.subscribe(function (params) {
            var id = params['id'];
            _this.getUser(id);
            _this.getCounters(id);
        });
    };
    ProfileComponent.prototype.getUser = function (userId) {
        var _this = this;
        this._userService.getUser(userId).subscribe(function (response) {
            if (response.user) {
                _this.user = response.user;
                if (response.following && response.following._id) {
                    _this.following = true;
                }
                else {
                    _this.following = false;
                }
                if (response.followed && response.followed._id) {
                    _this.followed = true;
                }
                else {
                    _this.followed = false;
                }
            }
            else {
                _this.status = 'error';
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
                //In case an error, redirect to the profile page of current user
                _this._router.navigate(['/profile', _this.identity._id]);
            }
        });
    };
    ProfileComponent.prototype.getCounters = function (userId) {
        var _this = this;
        this._userService.getCounters(userId).subscribe(function (response) {
            _this.stats = response;
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    ProfileComponent.prototype.followUser = function (userId) {
        var _this = this;
        var follow = new Follow('', this.identity._id, userId);
        this._followService.addFollow(this.token, follow).subscribe(function (response) {
            _this.following = true;
        }, function (error) {
            console.log(error);
        });
    };
    ProfileComponent.prototype.unfollowUser = function (userId) {
        var _this = this;
        this._followService.deleteFollow(this.token, userId).subscribe(function (response) {
            _this.following = false;
        }, function (error) {
            console.log(error);
        });
    };
    ProfileComponent.prototype.mouseEnter = function (userId) {
        this.followUserOver = userId;
    };
    ProfileComponent.prototype.mouseLeave = function () {
        this.followUserOver = 0;
    };
    ProfileComponent = __decorate([
        Component({
            selector: 'profile',
            templateUrl: './profile.component.html',
            styleUrls: ['./profile.component.css'],
            providers: [UserService, FollowService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            FollowService])
    ], ProfileComponent);
    return ProfileComponent;
}());
export { ProfileComponent };
//# sourceMappingURL=profile.component.js.map