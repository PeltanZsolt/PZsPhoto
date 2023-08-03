import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Observable, pipe, map, BehaviorSubject, tap, of } from 'rxjs';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../store/auth.store/auth.reducer';

@Injectable({
    providedIn: 'root',
})
export class AuthGuardService {
    isAdmin$ = new BehaviorSubject<boolean>(false);

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<AuthState>
    ) {}

    canActivate():
        | boolean
        | UrlTree
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> {
        this.store
            .select(createFeatureSelector<AuthState>('auth'))
            .pipe(map((state) => state.user.isAdmin))
            .subscribe((isAdmin) => {
                if (!isAdmin) {
                    this.router.navigate([''], { relativeTo: this.route });
                    return this.isAdmin$.next(false);
                }
                return this.isAdmin$.next(true);
            });
        return this.isAdmin$;
    }
}
