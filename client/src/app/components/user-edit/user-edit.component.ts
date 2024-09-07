import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'user-edit',
    templateUrl: './user-edit.component.html',
    styleUrls: ['./user-edit.component.css'],
    providers: [UserService, UploadService]
})
export class UserEditComponent implements OnInit {
    public title: string;
    public user: User;
    public identity: any;
    public token: string;
    public status: string;
    public filesToUpload: Array<File>;
    public url: string;
    public oldImageUrl: string; // URL de l'image existante

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService
    ) {
        this.title = 'Your Account';
        this.user = this._userService.getIdentity();
        this.identity = this.user;
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
    }

    ngOnInit() {
        console.log('User-Edit Component Working...');
        
        // Charger l'image existante de l'utilisateur
        if (this.user && this.user._id) {
            this._userService.getImage(this.user._id).subscribe(
                (response: Blob) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        this.oldImageUrl = reader.result as string;
                    };
                    reader.readAsDataURL(response);
                },
                error => {
                    console.error('Échec de la récupération de l\'image:', error);
                }
            );
        }
    }

    onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;

                    // Upload de la nouvelle image
                    if (this.filesToUpload && this.filesToUpload.length > 0) {
                        this._uploadService.makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                            .then((result: any) => {
                                // Mettre à jour l'image après upload
                                this.user.image = result.user.image.split('/').pop();
                                this.oldImageUrl = this.url + 'get-image-user/' + this.user.image; // Mettre à jour l'URL de l'image
                                console.log("Nouvelle Image:", this.user.image);
                                localStorage.setItem('identity', JSON.stringify(this.user));
                            })
                            .catch(error => {
                                console.error('Échec de l\'upload de l\'image:', error);
                            });
                    }
                }
            },
            error => {
                console.error('Échec de la mise à jour de l\'utilisateur:', error);
                this.status = 'error';
            }
        );
    }

    fileChangeEvent(event: any): void {
        this.filesToUpload = <Array<File>>event.target.files;
        console.log('Fichiers à uploader:', this.filesToUpload);
    }
}
