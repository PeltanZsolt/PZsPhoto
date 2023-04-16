import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ViewsService {
    baseUrl = environment.apiUrl;
    constructor(private http: HttpClient) {}

    getViewsNumber(photoId: number): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        return this.http
            .post(this.baseUrl + '/visitorsCount', photoId, { headers })
            .pipe(
                catchError((error) =>
                    this.handleError('getViewsNumber', error)
                )
            );
    }

    incrementViewsNr(photoId: number): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        const body = { photoId: photoId };
        return this.http
            .post(this.baseUrl + '/incrementViewsNr', body, { headers })
            .pipe(
                catchError((error) =>
                    this.handleError('incrementViewsNr', error)
                )
            );
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
