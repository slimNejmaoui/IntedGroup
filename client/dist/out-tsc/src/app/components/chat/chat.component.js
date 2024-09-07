import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Router, NavigationEnd } from '@angular/router';
import * as io from 'socket.io-client';
var ChatComponent = /** @class */ (function () {
    //public numberUsers : any;
    function ChatComponent(_userService, _router) {
        var _this = this;
        this._userService = _userService;
        this._router = _router;
        this.identity = this._userService.getIdentity();
        this.title = "Global Chat";
        this.nickname = this.identity.name + ' ' + this.identity.surname;
        this._router.events.subscribe(function (event) {
            if (event instanceof NavigationEnd) {
                if (_this.socket != null) {
                    _this.disconnection();
                }
            }
        });
    }
    ChatComponent.prototype.ngOnInit = function () {
    };
    ChatComponent.prototype.connection = function () {
        this.socket = io.connect(GLOBAL.url_general, { 'forceNew': true });
        $('#chat').css("display", "block");
        $('#start-chat').css("display", "none");
        this.start();
    };
    ChatComponent.prototype.start = function () {
        var conection = {
            nickname: this.nickname,
            connection: true
        };
        this.socket.emit('add-message', conection);
        this.socket.on('users', function (data) {
            document.getElementById('active_users').innerHTML = data;
        });
        this.socket.on('messages', function (data) {
            var html = data.map(function (message, index) {
                if (message.connection == true) {
                    return ("\n                        <div class=\"connection\">".concat(message.nickname, " has <strong>connected</strong></div>\n                    "));
                }
                else if (message.connection == false) {
                    return ("\n                        <div class=\"connection\">".concat(message.nickname, " has <strong>disconnected</strong></div>\n                    "));
                }
                else if (!message.connection) {
                    return ("\n                    <div class=\"message\">\n                        <strong>".concat(message.nickname, "</strong> says: <div class=\"hour\"><span>").concat(message.hora, "</span></div>\n                        <p>").concat(message.texto, "</p>\n                    </div>\n                    "));
                }
            }).join(' ');
            var div_msgs = document.getElementById('messages');
            div_msgs.innerHTML = html;
            div_msgs.scrollTop = div_msgs.scrollHeight;
        });
    };
    ChatComponent.prototype.onSubmit = function (form) {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var message = {
            nickname: this.nickname,
            texto: this.messageText,
            hora: hours + ":" + (minutes < 10 ? '0' : '') + minutes
        };
        this.socket.emit('add-message', message);
        form.reset();
        return false;
    };
    ChatComponent.prototype.disconnection = function () {
        var conection = {
            nickname: this.nickname,
            connection: false
        };
        $('#chat').css("display", "none");
        $('#start-chat').css("display", "block");
        this.socket.emit('disconnection', conection);
    };
    ChatComponent = __decorate([
        Component({
            selector: 'app-chat',
            templateUrl: './chat.component.html',
            styleUrls: ['./chat.component.css'],
            providers: [UserService]
        }),
        __metadata("design:paramtypes", [UserService,
            Router])
    ], ChatComponent);
    return ChatComponent;
}());
export { ChatComponent };
//# sourceMappingURL=chat.component.js.map