import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';
var UserEditComponent = /** @class */ (function () {
    function UserEditComponent(_route, _router, _userService, _uploadService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._uploadService = _uploadService;
        this.title = 'Your Account';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }
    UserEditComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('User-Edit Component Working...');
        // Charger l'image existante de l'utilisateur
        if (this.user && this.user._id) {
            this._userService.getImage(this.user._id).subscribe(function (response) {
                var reader = new FileReader();
                reader.onload = function () {
                    _this.oldImageUrl = reader.result;
                };
                reader.readAsDataURL(response);
            }, function (error) {
                console.error('Échec de la récupération de l\'image:', error);
            });
        }
    };
    UserEditComponent.prototype.onSubmit = function () {
        var _this = this;
        this._userService.updateUser(this.user).subscribe(function (response) {
            if (!response.user) {
                _this.status = 'error';
            }
            else {
                _this.status = 'success';
                localStorage.setItem('identity', JSON.stringify(_this.user));
                _this.identity = _this.user;
                // Upload de la nouvelle image
                if (_this.filesToUpload && _this.filesToUpload.length > 0) {
                    _this._uploadService.makeFileRequest(_this.url + 'upload-image-user/' + _this.user._id, [], _this.filesToUpload, _this.token, 'image')
                        .then(function (result) {
                        // Mettre à jour l'image après upload
                        _this.user.image = result.user.image.split('/').pop();
                        _this.oldImageUrl = _this.url + 'get-image-user/' + _this.user.image; // Mettre à jour l'URL de l'image
                        console.log("Nouvelle Image:", _this.user.image);
                        localStorage.setItem('identity', JSON.stringify(_this.user));
                    })
                        .catch(function (error) {
                        console.error('Échec de l\'upload de l\'image:', error);
                    });
                }
            }
        }, function (error) {
            console.error('Échec de la mise à jour de l\'utilisateur:', error);
            _this.status = 'error';
        });
    };
    UserEditComponent.prototype.fileChangeEvent = function (event) {
        this.filesToUpload = event.target.files;
        console.log('Fichiers à uploader:', this.filesToUpload);
    };
    UserEditComponent = __decorate([
        Component({
            selector: 'user-edit',
            templateUrl: './user-edit.component.html',
            styleUrls: ['./user-edit.component.css'],
            providers: [UserService, UploadService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            UploadService])
    ], UserEditComponent);
    return UserEditComponent;
}());
export { UserEditComponent };
//# sourceMappingURL=user-edit.component.js.map