import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
var MainComponent = /** @class */ (function () {
    function MainComponent() {
        this.title = 'Private Messages';
    }
    MainComponent.prototype.ngOnInit = function () {
        console.log("Messages Main Component Working...");
    };
    MainComponent.prototype.ngDoCheck = function () {
    };
    MainComponent = __decorate([
        Component({
            selector: 'main',
            templateUrl: './main.component.html',
            styleUrls: ['./main.component.css']
        }),
        __metadata("design:paramtypes", [])
    ], MainComponent);
    return MainComponent;
}());
export { MainComponent };
//# sourceMappingURL=main.component.js.map