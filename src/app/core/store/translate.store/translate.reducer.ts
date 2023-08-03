import { createReducer, on } from '@ngrx/store';
import * as TranslateActions from './translate.actions';

export interface TranslateState {
    languageIndex: number;
    languageCode: string;
}

const initialState: TranslateState = {
    languageIndex: 0,
    languageCode: '',
};

export const translateReducer = createReducer(
    initialState,

    on(TranslateActions.LanguageChangeSuccess, (state, action) => ({
        ...state,
        languageIndex: action.languageIndex,
        languageCode: action.languageCode,
    }))
);
