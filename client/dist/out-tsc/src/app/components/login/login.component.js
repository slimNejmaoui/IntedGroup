import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
var LoginComponent = /** @class */ (function () {
    function LoginComponent(_route, _router, _userService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this.status = '';
        this.loginError = false;
        this.title = 'Login';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }
    LoginComponent.prototype.ngOnInit = function () {
        console.log('Login Component Working...');
    };
    LoginComponent.prototype.onSubmit = function () {
        var _this = this;
        //User Login with data
        this._userService.signup(this.user).subscribe(function (response) {
            _this.identity = response.user;
            if (!_this.identity && !_this.identity._id) {
                _this.status == 'error';
                _this.loginError = true;
            }
            else {
                localStorage.setItem('identity', JSON.stringify(_this.identity));
                _this.getToken();
            }
            _this.status = 'success';
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
                _this.loginError = true;
            }
        });
    };
    LoginComponent.prototype.getToken = function () {
        var _this = this;
        //User Login with data
        this._userService.signup(this.user, 'true').subscribe(function (response) {
            _this.token = response.token;
            if (_this.token.length <= 0) {
                _this.status == 'error';
            }
            else {
                localStorage.setItem('token', _this.token);
                _this.getCounters();
            }
            _this.status = 'success';
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    LoginComponent.prototype.getCounters = function () {
        var _this = this;
        this._userService.getCounters().subscribe(function (response) {
            localStorage.setItem('stats', JSON.stringify(response));
            _this.status = 'success';
            _this._router.navigate(['/']);
        }, function (error) {
            console.log(error);
        });
    };
    LoginComponent.prototype.transitionEnd = function (e) {
        this.loginError = false;
    };
    LoginComponent = __decorate([
        Component({
            selector: 'login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService])
    ], LoginComponent);
    return LoginComponent;
}());
export { LoginComponent };
//# sourceMappingURL=login.component.js.map