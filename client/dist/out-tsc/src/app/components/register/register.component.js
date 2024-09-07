import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
var RegisterComponent = /** @class */ (function () {
    function RegisterComponent(_route, _router, _userService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this.title = 'Register';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
    }
    RegisterComponent.prototype.ngOnInit = function () {
        console.log('Register Component Working...');
    };
    RegisterComponent.prototype.onSubmit = function (form) {
        var _this = this;
        /*The subscribe method of Observable to take the response from the API*/ this._userService.register(this.user).subscribe(function (response) {
            //Check if the response comes with an user and an user _id
            if (response.user && response.user._id) {
                _this.status = 'success';
                //Reset all the form inputs
                form.reset();
            }
            else {
                _this.status = 'error';
            }
        }, function (error) {
            console.log('ERROR: ' + error);
        });
    };
    RegisterComponent = __decorate([
        Component({
            selector: 'register',
            templateUrl: './register.component.html',
            styleUrls: ['./register.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService])
    ], RegisterComponent);
    return RegisterComponent;
}());
export { RegisterComponent };
//# sourceMappingURL=register.component.js.map