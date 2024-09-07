import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
//CanActivate => Interface to be a guard deciding if a route can be activated
import { Router } from '@angular/router';
import { UserService } from './user.service';
var UserGuard = /** @class */ (function () {
    function UserGuard(_router, _userService) {
        this._router = _router;
        this._userService = _userService;
    }
    UserGuard.prototype.canActivate = function () {
        var identity = this._userService.getIdentity();
        if (identity && (identity.role == 'ROLE_USER' || identity.role == 'ROLE_ADMIN')) {
            return true;
        }
        else {
            this._router.navigate(['/(login)']);
            return false;
        }
    };
    UserGuard = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router,
            UserService])
    ], UserGuard);
    return UserGuard;
}());
export { UserGuard };
//# sourceMappingURL=user.guard.js.map