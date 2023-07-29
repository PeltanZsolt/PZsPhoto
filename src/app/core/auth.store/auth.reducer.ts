import { Action, createReducer, on } from '@ngrx/store';
import { User } from 'src/app/core/models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
    user: User;
    authErrorState: {
        hasError: boolean;
        message?: string;
    };
}

const initialState: AuthState = {
    user: new User(''),
    authErrorState: { hasError: false, message: '' },
};

export const authReducer = createReducer(
    initialState,

    on(AuthActions.LoginSuccess, (state, action) => ({
        ...state,
        authErrorState: {
            message: action.message,
            hasError: action.hasError,
        },
        user: new User(
            action.username,
            '',
            '',
            undefined,
            action.jwtToken,
            action.isAdmin
        ),
    })),

    on(AuthActions.LoginError, (state, action) => ({
        ...state,
        authErrorState: {
            message: action.message,
            hasError: action.hasError,
        },
    })),

    on(AuthActions.SignupSuccess, (state, action) => ({
        ...state,
        authErrorState: {
            message: action.message,
            hasError: action.hasError,
        },
        user: new User(
            action.username,
            '',
            '',
            undefined,
            action.jwtToken,
            false
        ),
    })),

    on(AuthActions.SignupError, (state, action) => ({
        ...state,
        authErrorState: {
            message: action.message,
            hasError: action.hasError,
        },
    })),

    on(AuthActions.Logout, (state, action) => ({
        ...state,
        authErrorState: {
            message: '',
            hasError: false,
        },
        user: new User(),
    }))
);
