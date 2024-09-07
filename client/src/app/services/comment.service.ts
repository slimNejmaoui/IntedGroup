import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';

@Injectable()
export class CommentService {
  public url: string;

  constructor(private _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  addComment(token: string, publicationId: string, text: string): Observable<any> {
    let params = JSON.stringify({ text: text });
    let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                   .set('Authorization', token); // Ajout du token dans l'en-tête

    return this._http.post(this.url + 'add-comment/' + publicationId, params, { headers: headers });
  }

  getComments(publicationId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this._http.get(this.url + 'comments/' + publicationId, { headers: headers });
  }
}
