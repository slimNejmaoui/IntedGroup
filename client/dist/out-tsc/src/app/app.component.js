import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from './services/global';
import { Title } from '@angular/platform-browser';
var AppComponent = /** @class */ (function () {
    function AppComponent(_route, _router, _userService, titleService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this.titleService = titleService;
        this.title = 'NGSocial';
        this.url = GLOBAL.url;
        this.titleService.setTitle(this.title);
    }
    AppComponent.prototype.ngOnInit = function () {
        //Call User Service to get user identity if available in global component
        this.identity = this._userService.getIdentity();
    };
    //With any change in components, refresh variables
    AppComponent.prototype.ngDoCheck = function () {
        this.identity = this._userService.getIdentity();
    };
    AppComponent.prototype.lougout = function () {
        localStorage.clear();
        this.identity = null;
        this._router.navigate(['/']);
    };
    AppComponent = __decorate([
        Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            Title])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=app.component.js.map