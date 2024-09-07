import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
var ResetPasswordComponent = /** @class */ (function () {
    function ResetPasswordComponent(_router, _userService, toastr) {
        this._router = _router;
        this._userService = _userService;
        this.toastr = toastr;
        this.loading = true;
        this.title = 'Reset Password';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        console.log('Reset Password Component Working...');
        this.loading = false;
    };
    ResetPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        //User Login with data
        this.loading = true;
        this._userService.resetPassword(this.user.email, this.resetToken, this.user.password).subscribe(function (response) {
            _this.loading = false;
            _this.toastr.success(response.message);
            _this._router.navigate(['/login']);
        }, function (error) {
            _this.loading = false;
            _this.toastr.error(error.error.error);
        });
    };
    ResetPasswordComponent = __decorate([
        Component({
            selector: 'app-reset-password',
            templateUrl: './reset-password.component.html',
            styleUrls: ['./reset-password.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [Router,
            UserService,
            ToastrService])
    ], ResetPasswordComponent);
    return ResetPasswordComponent;
}());
export { ResetPasswordComponent };
//# sourceMappingURL=reset-password.component.js.map