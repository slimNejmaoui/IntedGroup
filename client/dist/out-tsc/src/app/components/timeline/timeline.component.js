import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Like } from '../../models/like';
import { LikeService } from '../../services/like.service';
import { CommentService } from 'src/app/services/comment.service';
var TimelineComponent = /** @class */ (function () {
    function TimelineComponent(_route, _router, _userService, _publicationService, _likeService, _commentService) {
        this._route = _route;
        this._router = _router;
        this._userService = _userService;
        this._publicationService = _publicationService;
        this._likeService = _likeService;
        this._commentService = _commentService;
        //Check if show or no button of Load More
        this.noMore = false;
        this.title = 'Timeline';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
        this.loading = true;
    }
    TimelineComponent.prototype.ngOnInit = function () {
        console.log("Timeline Component Working...");
        this.getPublications(this.page);
    };
    TimelineComponent.prototype.getPublications = function (page, adding) {
        var _this = this;
        if (adding === void 0) { adding = false; }
        this._publicationService.getPublications(this.token, page).subscribe(function (response) {
            if (response.publications) {
                _this.loading = false;
                _this.total = response.total_items;
                _this.pages = response.pages;
                _this.itemsPerPage = response.items_per_page;
                console.log(response.publications);
                console.log(_this.page);
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
                    $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500);
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
    //The Button View More
    TimelineComponent.prototype.viewMore = function () {
        this.page += 1;
        if (this.page == this.pages) {
            this.noMore = true;
        }
        this.getPublications(this.page, true);
    };
    //This functions comes from the component child Sidebar (Output), when the button post publication is clicked
    TimelineComponent.prototype.refresh = function (event) {
        if (event === void 0) { event = null; }
        this.page = 1;
        this.getPublications(this.page);
        this.noMore = false;
    };
    TimelineComponent.prototype.showThisImage = function (id) {
        this.showImage = id;
    };
    TimelineComponent.prototype.hideThisImage = function (id) {
        this.showImage = 0;
    };
    TimelineComponent.prototype.deletePublication = function (id) {
        var _this = this;
        this._publicationService.deletePublication(this.token, id).subscribe(function (response) {
            _this.refresh();
        }, function (error) {
            console.log(error);
        });
    };
    TimelineComponent.prototype.updateLikes = function () {
        var _this = this;
        this.publications.forEach(function (publication, index) {
            var likes = _this.getLikes(_this.publications[index]._id)
                .then(function (value) {
                _this.likes = [].concat(value);
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
    TimelineComponent.prototype.doLike = function (publication, event) {
        if (publication.liked) {
            event.target.src = '../../../assets/images/empty-heart.png';
            this.quitLike(publication._id);
        }
        else if (!publication.liked) {
            event.target.src = '../../../assets/images/liked-heart.png';
            this.addLike(publication._id);
        }
    };
    TimelineComponent.prototype.addLike = function (publicationId) {
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
    TimelineComponent.prototype.quitLike = function (publicationId) {
        var _this = this;
        this._likeService.deleteLike(this.token, publicationId).subscribe(function (response) {
            _this.updateLikes();
        }, function (error) {
            var errorMessage = error;
            console.log(errorMessage);
        });
    };
    TimelineComponent.prototype.getLikes = function (publicationId) {
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
    TimelineComponent.prototype.addComment = function (publicationId, commentText) {
        var _this = this;
        if (commentText.trim()) {
            this._commentService.addComment(this.token, publicationId, commentText).subscribe(function (response) {
                if (response) {
                    _this.refresh(); // Recharger les publications pour voir les nouveaux commentaires
                }
            }, function (error) {
                console.log(error);
            });
        }
    };
    TimelineComponent = __decorate([
        Component({
            selector: 'timeline',
            templateUrl: './timeline.component.html',
            styleUrls: ['./timeline.component.css'],
            providers: [UserService, PublicationService, LikeService]
        }),
        __metadata("design:paramtypes", [ActivatedRoute,
            Router,
            UserService,
            PublicationService,
            LikeService,
            CommentService])
    ], TimelineComponent);
    return TimelineComponent;
}());
export { TimelineComponent };
//# sourceMappingURL=timeline.component.js.map