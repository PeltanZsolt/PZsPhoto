import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as TranslateActions from './translate.actions';
import { map } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { locales } from '../../models/locales.model';

@Injectable()
export class TranslateEffects {
    languageIndex = 0;
    languageCode = '';

    constructor(
        private actions$: Actions,
        private translateService: TranslateService
    ) {}

    loginStart$ = createEffect(() =>
        this.actions$.pipe(
            ofType(TranslateActions.LanguageChangeStart),

            map((languageChangeData: any) => {
                this.translateService.setTranslation(
                    locales[languageChangeData.languageIndex].lang,
                    locales[languageChangeData.languageIndex].data,
                    true
                );
                this.translateService.use(
                    locales[languageChangeData.languageIndex].lang
                );

                return TranslateActions.LanguageChangeSuccess(
                    languageChangeData
                );
            })
        )
    );
}
