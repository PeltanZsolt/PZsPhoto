import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../auth.store/auth.reducer';

@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
    constructor(private store: Store<AuthState>) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        let jwtToken;
        this.store
            .select(createFeatureSelector<AuthState>('auth'))
            .subscribe((state) => {
                jwtToken = state.user.jwtToken;
            });

        if (jwtToken) {
            const modifiedRequest = req.clone({
                headers: req.headers.append('jwttoken', jwtToken),
            });
            return next.handle(modifiedRequest);
        } else {
            return next.handle(req);
        }
    }
}
