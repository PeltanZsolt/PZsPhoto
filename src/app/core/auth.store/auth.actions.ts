import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/core/models/user.model';

export const LoginStart = createAction(
    '[Login Component] Login Start',
    props<{
        user: User;
    }>()
);

export const LoginError = createAction(
    '[Login Component] Login Error',
    props<{
        hasError: boolean;
        message: string;
    }>()
);

export const LoginSuccess = createAction(
    '[Login Component] Login Success',
    props<{
        username: string;
        hasError: boolean;
        message: string;
        isAdmin: boolean;
        jwtToken: string;
    }>()
);

export const SignupStart = createAction(
    '[Signup Component] Signup Start',
    props<{
        user: User
    }>()
);

export const SignupError = createAction(
    '[Signup Component] Signup Error',
    props<{
        hasError: boolean;
        message: string;
    }>()
);

export const SignupSuccess = createAction(
    '[Signup Component] Signup Success',
    props<{
        username: string;
        hasError: boolean;
        message: string;
        isAdmin: boolean;
        jwtToken: string;
    }>()
);

export const Logout = createAction('[Logout Component] Logout');
