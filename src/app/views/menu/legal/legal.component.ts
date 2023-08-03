import { Component, OnInit } from '@angular/core';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { TranslateState } from 'src/app/core/store/translate.store/translate.reducer';

@Component({
    selector: 'app-legal',
    templateUrl: './legal.component.html',
    styleUrls: ['./legal.component.scss'],
})
export class LegalComponent implements OnInit{
    language$: Observable<string>;

    constructor(private translateStore: Store<TranslateState>) {}

    ngOnInit(): void {
        this.language$ = this.translateStore.select(createFeatureSelector<TranslateState>('translate')).pipe(map(state => state.languageCode))
    }

}
