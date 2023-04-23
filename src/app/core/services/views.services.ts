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

    incrementViewsNr(photoId: number): Observable<any> {
        const headers = new HttpHeaders({ 'content-type': 'application/json' });
        const body = { photoId: photoId };
        return this.http
            .post(this.baseUrl + '/viewsNr/increment', body, { headers })
            .pipe(
                catchError((error) =>
                    this.handleError('viewsNr/increment', error)
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
        return of({error: error.message});
    }
}
