import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class VisitorsService {
    url = environment.apiUrl;
    constructor(private http: HttpClient) {}

    getVisitorsNumber(): Observable<any> {
        return this.http.get('https://api.ipify.org/?format=json').pipe(
            switchMap((ipifyRes: any) => {
                const headers = new HttpHeaders({
                    'content-type': 'application/json',
                });
                return this.http
                    .post(this.url + '/visitorsCount', ipifyRes, { headers })
                    .pipe(
                        catchError((error) =>
                            this.handleError('getVisitorsNumber', error)
                        )
                    );
            }),
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



    getHostIP() {
        return this.http.get('getHostIp')
    }
}
