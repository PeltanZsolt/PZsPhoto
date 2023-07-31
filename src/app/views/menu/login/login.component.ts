import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Store, createFeatureSelector } from '@ngrx/store';
import * as AuthActions from '../../../core/auth.store/auth.actions';
import { AuthState } from 'src/app/core/auth.store/auth.reducer';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    username: string;
    password: string;

    subscriptions: Subscription[] = [];

    constructor(
        private dialog: MatDialog,
        private dialogRef: DialogRef,
        private store: Store<{
            auth: {
                user: User;
                authErrorState: {
                    message: string;
                    hasError: boolean;
                };
            };
        }>
    ) {}

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            username: new FormControl(this.username, Validators.required),
            password: new FormControl(this.password, Validators.required),
        });

        this.subscriptions.push(
            this.store
                .select(createFeatureSelector<AuthState>('auth'))
                .subscribe((state: AuthState) => {
                    this.handleLoginResponse(state);
                })
        );
    }

    sumbitLogin() {
        this.username = this.formGroup.controls['username'].value;
        this.password = this.formGroup.controls['password'].value;
        const user = new User(this.username, this.password);
        this.store.dispatch(AuthActions.LoginStart({ user }));
    }

    handleLoginResponse(authState: AuthState): void {
        if (authState.authErrorState.hasError) {
            switch (authState.authErrorState.message) {
                case `Invalid username.`: {
                    const data: ErrorDialogData = {
                        messageHeader: 'Invalid username.',
                        messageBody: `Username doesn't exist. Check username or sign up as a new user.`,
                        duration: 5000,
                    };
                    this.dialog.open(ErrordialogComponent, {
                        data: data,
                    });
                    break;
                }
                case `Incorrect password`: {
                    const data: ErrorDialogData = {
                        messageHeader: 'Incorrect username or password',
                        messageBody: `Check your credentials.`,
                        duration: 5000,
                    };
                    this.dialog.open(ErrordialogComponent, {
                        data: data,
                    });
                    break;
                }
                default: {
                    const data: ErrorDialogData = {
                        messageHeader: 'Error',
                        messageBody: `Something went wrong. Tray again later.`,
                        duration: 5000,
                    };
                    this.dialog.open(ErrordialogComponent, {
                        data: data,
                    });
                }
            }
        } else if (authState.user.username) {
            const data: SuccessDialogData = {
                message: authState.authErrorState.message!,
                duration: 2000,
            };
            this.dialog.open(SuccessdialogComponent, {
                data: data,
            });

            setTimeout(() => this.dialogRef.close(), 2000);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
