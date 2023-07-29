import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private http: HttpClient) {}
    url = environment.apiUrl;

    login(user: User): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        const body = JSON.stringify(user);
        return this.http
            .post(this.url + '/login', body, { headers })
            .pipe(catchError((error) => this.handleError('login', error)));
    }

    signUp(user: User): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        const body = JSON.stringify(user);
        return this.http
            .post(this.url + '/signup', body, { headers })
            .pipe(catchError((error) => this.handleError('signUp', error)));
    }

    private handleError(operation: string, error: HttpErrorResponse) {
        console.log(
            'Error occured on UserService.' +
                operation +
                ': ' +
                '\n' +
                error.message
        );
        return of({ error: error.message });
    }
}
