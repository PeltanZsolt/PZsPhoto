import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/auth.store/auth.reducer';
import * as AuthActions from '../../../core/store/auth.store/auth.actions';
import { map, take } from 'rxjs';

@Component({
    selector: 'app-logoutdialog',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
    constructor(
        public dialogRef: MatDialogRef<LogoutComponent>,
        private router: Router,
        private store: Store<AuthState>,
        @Inject(MAT_DIALOG_DATA) public data: null
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
    onOkClick(): void {
        this.dialogRef.close();

        this.store
            .select(createFeatureSelector<AuthState>('auth'))
            .pipe(
                take(1),
                map((state) => {
                    if (state.user.isAdmin) {
                        this.router.navigate(['/']);
                    }
                    this.store.dispatch(AuthActions.Logout());
                })
            )
            .subscribe();
    }
}
