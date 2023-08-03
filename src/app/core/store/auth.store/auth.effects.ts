import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { map, switchMap } from 'rxjs';
import { UserService } from 'src/app/core/services/user.service';

@Injectable()
export class AuthEffects {
    username = '';

    constructor(private actions$: Actions, private userService: UserService) {}

    loginStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.LoginStart),
            switchMap((loginData: any) => {
                this.username = loginData.user.username;
                return this.userService.login(loginData.user);
            }),
            map((response) => {
                if (response.message === 'Login successful') {
                    return AuthActions.LoginSuccess({
                        username: this.username,
                        hasError: false,
                        message: response.message,
                        isAdmin: response.isAdmin,
                        jwtToken: response.jwtToken,
                    });
                } else {
                    return AuthActions.LoginError({
                        hasError: true,
                        message: response.message,
                    });
                }
            })
        )
    );

    signupStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.SignupStart),
            switchMap((loginData: any) => {
                this.username = loginData.user.username;
                return this.userService.signUp(loginData.user);
            }),
            map((response) => {
                if (response.message === 'Signup successful!') {
                    return AuthActions.SignupSuccess({
                        username: this.username,
                        hasError: false,
                        message: response.message,
                        isAdmin: response.isAdmin,
                        jwtToken: response.jwtToken,
                    });
                } else {
                    return AuthActions.SignupError({
                        hasError: true,
                        message: response.message,
                    });
                }
            })
        )
    );
}
