import { __decorate } from "tslib";
//MODULES
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//COMPONENTS
import { MainComponent } from './components/main/main.component';
import { AddComponent } from './components/add/add.component';
import { ReceivedComponent } from './components/received/received.component';
import { SentComponent } from './components/sent/sent.component';
import { UserGuard } from '../services/user.guard';
var messagesRoutes = [
    {
        path: 'messages',
        component: MainComponent,
        children: [
            { path: '', redirectTo: 'send', pathMatch: 'full' },
            { path: 'send', component: AddComponent, canActivate: [UserGuard] },
            { path: 'received', component: ReceivedComponent, canActivate: [UserGuard] },
            { path: 'received/:page', component: ReceivedComponent, canActivate: [UserGuard] },
            { path: 'sent', component: SentComponent, canActivate: [UserGuard] },
            { path: 'sent/:page', component: SentComponent, canActivate: [UserGuard] }
        ]
    }
];
var MessagesRoutingModule = /** @class */ (function () {
    function MessagesRoutingModule() {
    }
    MessagesRoutingModule = __decorate([
        NgModule({
            imports: [
                RouterModule.forChild(messagesRoutes)
            ],
            exports: [
                RouterModule
            ]
        })
    ], MessagesRoutingModule);
    return MessagesRoutingModule;
}());
export { MessagesRoutingModule };
//# sourceMappingURL=messages-routing.module.js.map