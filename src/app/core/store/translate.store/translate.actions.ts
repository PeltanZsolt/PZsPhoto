import { createAction, props } from '@ngrx/store';

export const LanguageChangeStart = createAction(
    '[Translate] Language Change Start',
    props<{
        languageIndex: number;
        languageCode: string;
    }>()
);
export const LanguageChangeSuccess = createAction(
    '[Translate] Language Change Success',
    props<{
        languageIndex: number;
        languageCode: string;
    }>()
);
