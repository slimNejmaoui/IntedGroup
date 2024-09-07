import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Like } from '../../models/like';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { LikeService } from '../../services/like.service';
import { GLOBAL } from '../../services/global';
var PublicationsComponent = /** @class */ (function () {
    function PublicationsComponent(_route, _router, _userService, _publicationService, _likeService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._publicationService = _publicationService;
        this._likeService = _likeService;
        this.noMore = false;
        this.title = 'Publications';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.loading = true;
    }
    PublicationsComponent.prototype.ngOnInit = function () {
        console.log("Publications Component Working...");
        this.getPublications(this.user, this.page);
    };
    PublicationsComponent.prototype.ngOnChanges = function () {
        this.getPublications(this.user, this.page);
    };
    PublicationsComponent.prototype.getPublications = function (user, page, adding) {
        var _this = this;
        if (adding === void 0) { adding = false; }
        this._publicationService.getPublicationsUser(this.token, user, page).subscribe(function (response) {
            if (response.publications) {
                _this.loading = false;
                _this.total = response.total_items;
                _this.pages = response.pages;
                _this.itemsPerPage = response.items_per_page;
                if (!adding) {
                    _this.publications = response.publications;
                }
                else {
                    //Array of current page publications
                    var arrayA = _this.publications;
                    //New array of the request
                    var arrayB = response.publications;
                    //Concat the actual array of publications with the new array of request (wiht adding parameter) of the button
                    _this.publications = arrayA.concat(arrayB);
                    //Scroll down if more publications
                    $("html, body").animate({ scrollTop: $('html').prop("scrollHeight") }, 500);
                }
                //UPDATE LIKES COUNTER AND HEART
                _this.updateLikes();
                if (page > _this.pages) {
                    //this._router.navigate(['/timeline']);
                }
            }
            else {
                _this.status = 'error';
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
            if (errorMessage != null) {
                _this.status == 'error';
            }
        });
    };
    PublicationsComponent.prototype.updateLikes = function () {
        var _this = this;
        this.publications.forEach(function (publication, index) {
            var likes = _this.getLikes(_this.publications[index]._id)
                .then(function (value) {
                _this.likes = [].concat(value);
                //CREATE NEW PROPERTY ON PUBLICATIONS TO STORE THE LIKES
                Object.defineProperty(_this.publications[index], 'likes', {
                    value: _this.likes,
                    writable: true
                });
                Object.defineProperty(_this.publications[index], 'liked', {
                    value: false,
                    writable: true
                });
                _this.likes.forEach(function (like) {
                    if (like.user._id == _this.identity._id) {
                        _this.publications[index].liked = true;
                    }
                });
            }).catch(function (error) { return console.log(error); });
        });
    };
    PublicationsComponent.prototype.doLike = function (publication, event) {
        if (publication.liked) {
            event.target.src = '../../../assets/images/empty-heart.png';
            this.quitLike(publication._id);
        }
        else if (!publication.liked) {
            event.target.src = '../../../assets/images/liked-heart.png';
            this.addLike(publication._id);
        }
    };
    PublicationsComponent.prototype.addLike = function (publicationId) {
        var _this = this;
        var like = new Like('', this.identity._id, publicationId);
        this._likeService.addLike(this.token, like).subscribe(function (response) {
            if (response.like) {
                _this.updateLikes();
            }
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
        });
    };
    PublicationsComponent.prototype.quitLike = function (publicationId) {
        var _this = this;
        this._likeService.deleteLike(this.token, publicationId).subscribe(function (response) {
            _this.updateLikes();
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
        });
    };
    PublicationsComponent.prototype.getLikes = function (publicationId) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._likeService.getLikes(_this.token, publicationId).subscribe(function (response) {
                if (response.likes)
                    resolve(response.likes);
            }, function (error) {
                reject(error);
            });
        });
        return promise;
    };
    PublicationsComponent.prototype.viewMore = function () {
        this.page += 1;
        if (this.page >= this.pages) {
            this.noMore = true;
        }
        this.getPublications(this.user, this.page, true);
    };
    __decorate([
        Input(),
        __metadata("design:type", String)
    ], PublicationsComponent.prototype, "user", void 0);
    PublicationsComponent = __decorate([
        Component({
            selector: 'publications',
            templateUrl: './publications.component.html',
            styleUrls: ['./publications.component.css'],
            providers: [UserService, PublicationService, LikeService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            PublicationService,
            LikeService])
    ], PublicationsComponent);
    return PublicationsComponent;
}());
export { PublicationsComponent };
//# sourceMappingURL=publications.component.js.map