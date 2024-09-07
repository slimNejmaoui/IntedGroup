import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Output } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import { PublicationService } from '../../services/publication.service';
import { UploadService } from '../../services/upload.service';
import { ToastrService } from 'ngx-toastr';
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent(_userService, _publicationService, _route, _router, _uploadService, toastr) {
        this._userService = _userService;
        this._publicationService = _publicationService;
        this._route = _route;
        this._router = _router;
        this._uploadService = _uploadService;
        this.toastr = toastr;
        //Output, Make the event available for the parent component
        this.sent = new EventEmitter();
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this.getCounters();
        this.url = GLOBAL.url;
        this.publication = new Publication('', '', '', '', this.identity._id);
        this.loading = true;
    }
    SidebarComponent.prototype.ngOnInit = function () {
        console.log("Sidebar Compent Working...");
        this.loading = false;
    };
    SidebarComponent.prototype.onSubmit = function (form, $event) {
        var _this = this;
        this.loading = true;
        this._publicationService.addPublication(this.token, this.publication).subscribe(function (response) {
            if (response.publication) {
                if (_this.filesToUpload && _this.filesToUpload.length) {
                    //UPLOAD IMAGE
                    _this._uploadService.makeFileRequest(_this.url + 'upload-image-publication/' + response.publication._id, [], _this.filesToUpload, _this.token, 'image')
                        .then(function (result) {
                        _this.publication.file = result.image;
                        _this.loading = false;
                        _this.toastr.success('Posted correctly');
                        _this.getCounters();
                        form.reset();
                        _this._router.navigate(['/timeline']);
                        _this.sent.emit({ send: 'true' });
                    });
                }
                else {
                    _this.loading = false;
                    _this.toastr.success('Posted correctly');
                    _this.getCounters();
                    form.reset();
                    _this._router.navigate(['/timeline']);
                    _this.sent.emit({ send: 'true' });
                }
            }
            else {
                _this.loading = false;
                _this.toastr.error('Not posted.');
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    SidebarComponent.prototype.fileChangeEvent = function (fileInput) {
        this.filesToUpload = fileInput.target.files;
    };
    SidebarComponent.prototype.getCounters = function () {
        var _this = this;
        this._userService.getCounters(this.identity._id).subscribe(function (response) {
            _this.stats = response;
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status = 'error';
            }
        });
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], SidebarComponent.prototype, "sent", void 0);
    SidebarComponent = __decorate([
        Component({
            selector: 'sidebar',
            templateUrl: './sidebar.component.html',
            styleUrls: ['./sidebar.component.css'],
            providers: [UserService, PublicationService, UploadService, ToastrService]
        }),
        __metadata("design:paramtypes", [UserService,
            PublicationService,
            ActivatedRoute,
            Router,
            UploadService,
            ToastrService])
    ], SidebarComponent);
    return SidebarComponent;
}());
export { SidebarComponent };
//# sourceMappingURL=sidebar.component.js.map