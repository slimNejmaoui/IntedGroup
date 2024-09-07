import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
var ForgotPasswordComponent = /** @class */ (function () {
    function ForgotPasswordComponent(_router, _userService, toastr) {
        this._router = _router;
        this._userService = _userService;
        this.toastr = toastr;
        this.loading = true;
        this.title = 'Forgot Password';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }
    ForgotPasswordComponent.prototype.ngOnInit = function () {
        console.log('Forgot Password Component Working...');
        this.loading = false;
    };
    ForgotPasswordComponent.prototype.onSubmit = function () {
        var _this = this;
        //User Login with data
        this.loading = true;
        this._userService.forgotPassword(this.user.email).subscribe(function (response) {
            _this.loading = false;
            _this.toastr.success(response.message);
            _this._router.navigate(['/reset-password']);
        }, function (error) {
            _this.loading = false;
            _this.toastr.error(error.error.error);
        });
    };
    ForgotPasswordComponent = __decorate([
        Component({
            selector: 'forgot-password',
            templateUrl: './forgot-password.component.html',
            styleUrls: ['./forgot-password.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [Router,
            UserService,
            ToastrService])
    ], ForgotPasswordComponent);
    return ForgotPasswordComponent;
}());
export { ForgotPasswordComponent };
//# sourceMappingURL=forgot-password.component.js.map