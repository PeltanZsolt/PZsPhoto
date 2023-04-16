import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Comment } from '../models/comment.model';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommentService {
    constructor(private http: HttpClient) {}
    url = environment.apiUrl;

    postComment(comment: Comment): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        const body = JSON.stringify({ comment });
        return this.http
            .post<any>(this.url + '/comment', body, {
                headers: headers,
            })
            .pipe(catchError((error) => this.handleError('login', error)));
    }

    getCommentsByPhotoId(photoId: number): Observable<any> {
        const params = new HttpParams().set('photoId', photoId);
        return this.http
            .get(this.url + '/comment', { params: params })
            .pipe(catchError((error) => this.handleError('login', error)));
    }

    private handleError(operation: string, error: HttpErrorResponse) {
        console.log(
            'Error occured on VisitorsService.' +
                operation +
                ': ' +
                '\n' +
                error.message
        );
        return of();
    }
}
