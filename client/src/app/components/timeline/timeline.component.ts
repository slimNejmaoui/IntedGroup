import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Publication } from '../../models/publication';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { CommentService } from '../../services/comment.service'; // Import du service de commentaires
import { GLOBAL } from '../../services/global';
import { Like } from '../../models/like';
import { LikeService } from '../../services/like.service';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css'],
  providers: [UserService, PublicationService, LikeService, CommentService] // Ajout du service de commentaires
})
export class TimelineComponent implements OnInit {
  public title: string;
  public identity;
  public token;
  public url: string;
  public status: string;
  public page: number;
  public total;
  public pages;
  public itemsPerPage;
  public publications: any[];
  public noMore = false;
  public showImage;
  public loading: boolean;
  public likes: any[];
  public liked: boolean;
  public newCommentText: { [key: string]: string } = {}; // Pour stocker le texte des nouveaux commentaires

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _likeService: LikeService,
    private _commentService: CommentService // Ajout du service de commentaires
  ) {
    this.title = 'Timeline';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;
    this.loading = true;
  }

  ngOnInit() {
    this.getPublications(this.page);
  }

  getPublications(page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.loading = false;
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if (!adding) {
            this.publications = response.publications;
          } else {
            this.publications = this.publications.concat(response.publications);
            $("html, body").animate({ scrollTop: $('body').prop("scrollHeight") }, 500);
          }

          this.updateLikes();
          this.updateComments();

          if (page > this.pages) {
            //this._router.navigate(['/timeline']);
          }
        } else {
          this.status = 'error';
        }
      },
      error => {
        console.log(<any>error);
        this.status = 'error';
      }
    );
  }

  viewMore() {
    this.page += 1;
    if (this.page == this.pages) {
      this.noMore = true;
    }
    this.getPublications(this.page, true);
  }

  refresh(event = null) {
    this.page = 1;
    this.getPublications(this.page);
    this.noMore = false;
  }

  showThisImage(id) {
    this.showImage = id;
  }

  hideThisImage(id) {
    this.showImage = 0;
  }

  deletePublication(id) {
    this._publicationService.deletePublication(this.token, id).subscribe(
      response => {
        this.refresh();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  updateLikes() {
    this.publications.forEach((publication, index) => {
      this.getLikes(publication._id).then((value) => {
        this.likes = [].concat(value);
        Object.defineProperty(this.publications[index], 'likes', { value: this.likes, writable: true });
        Object.defineProperty(this.publications[index], 'liked', { value: false, writable: true });
        this.likes.forEach((like) => {
          if (like.user._id == this.identity._id) {
            this.publications[index].liked = true;
          }
        });
      }).catch(error => console.log(error));
    });
  }

  doLike(publication, event: any) {
    if (publication.liked) {
      event.target.src = '../../../assets/images/empty-heart.png';
      this.quitLike(publication._id);
    } else {
      event.target.src = '../../../assets/images/liked-heart.png';
      this.addLike(publication._id);
    }
  }

  addLike(publicationId) {
    var like = new Like('', this.identity._id, publicationId);
    this._likeService.addLike(this.token, like).subscribe(
      response => {
        if (response.like) {
          this.updateLikes();
        }
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  quitLike(publicationId) {
    this._likeService.deleteLike(this.token, publicationId).subscribe(
      response => {
        this.updateLikes();
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  getLikes(publicationId: string) {
    let promise = new Promise((resolve, reject) => {
      this._likeService.getLikes(this.token, publicationId).subscribe(
        response => {
          if (response.likes) resolve(response.likes);
        },
        error => {
          reject(error);
        }
      );
    });
    return promise;
  }

  updateComments() {
    this.publications.forEach((publication, index) => {
      this._commentService.getComments(publication._id).subscribe(
        response => {
          if (response.comments) {
            Object.defineProperty(this.publications[index], 'comments', { value: response.comments, writable: true });
          }
        },
        error => console.log(<any>error)
      );
    });
  }

  addComment(publicationId: string) {
    const commentText = this.newCommentText[publicationId];
    if (commentText) {
      this._commentService.addComment(this.token, publicationId, commentText).subscribe(
        response => {
          if (response.comment) {
            this.newCommentText[publicationId] = ''; // Réinitialisation du texte après ajout du commentaire
            this.updateComments();
          }
        },
        error => console.log(<any>error)
      );
    }
  }
}
