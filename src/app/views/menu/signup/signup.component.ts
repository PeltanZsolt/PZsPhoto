import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, tap, startWith } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from 'src/app/core/store/auth.store/auth.reducer';
import * as AuthActions from '../../../core/store/auth.store/auth.actions';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit, OnDestroy {
    formGroup: FormGroup;
    username: string;
    password: string;
    passwordVerify: string;
    pwdEqualsError = false;
    user: User;
    generatedPassword: string;
    hide = false;

    subscriptions: Subscription[] = [];

    constructor(
        private dialog: MatDialog,
        private dialogRef: DialogRef,
        private store: Store<AuthState>
    ) {}

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            username: new FormControl(this.username, Validators.required),
            password: new FormControl(this.password, Validators.required),
            passwordVerify: new FormControl(
                this.passwordVerify
            ),
        });
        this.subscriptions.push(
            this.formGroup.valueChanges
                .pipe(
                    debounceTime(250),
                    startWith(''),
                    tap(() => {
                        this.username =
                            this.formGroup.controls['username'].value;
                        this.password =
                            this.formGroup.controls['password'].value;
                        this.passwordVerify =
                            this.formGroup.controls['passwordVerify'].value;

                        if (this.password === this.passwordVerify) {
                            this.formGroup.controls['passwordVerify'].setErrors(
                                null
                            );
                        } else {
                            this.formGroup.controls['passwordVerify'].setErrors(
                                { invalid: true }
                            );
                        }
                    })
                )
                .subscribe()
        );
        this.generatePassword();

        this.subscriptions.push(
            this.store
                .select(createFeatureSelector<AuthState>('auth'))
                .subscribe((state: AuthState) => {
                    this.handleSignupResponse(state.authErrorState);
                })
        );
    }

    generatePassword() {
        const length = 15;
        const characterList =
            '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$';
        this.generatedPassword = Array.from(
            crypto.getRandomValues(new Uint32Array(length))
        )
            .map((x) => characterList[x % characterList.length])
            .join('');
    }

    onClickGeneratedPassword(event: any) {
        this.formGroup.controls['passwordVerify'].setValue(
            event.target.textContent.trim()
        );
    }

    onSignUp() {
        this.user = new User(
            this.username.trim(),
            this.password.trim(),
            this.passwordVerify.trim()
        );

        const user = new User(
            this.user.username,
            this.user.password,
            this.user.passwordVerify
        );

        this.store.dispatch(AuthActions.SignupStart({ user }));
    }

    handleSignupResponse(authState: any): void {
        switch (authState.message) {
            case 'Username already exists.': {
                const data: ErrorDialogData = {
                    messageHeader: 'Could not sign up. Username already exists',
                    messageBody: 'Please choose another username.',
                    duration: 5000,
                };
                this.dialog.open(ErrordialogComponent, {
                    data: data,
                });
                break;
            }
            case `Passwords doesn't match`: {
                const data: ErrorDialogData = {
                    messageHeader: authState.message,
                    messageBody: 'Verify your credentials.',
                    duration: 5000,
                };
                this.dialog.open(ErrordialogComponent, {
                    data: data,
                });
                break;
            }
            case 'Weak password': {
                const data: ErrorDialogData = {
                    messageHeader: 'Password is too weak!',
                    messageBody:
                        'Please input a password with at least 15 characters containing lowercase and uppercase letters and a number.',
                    duration: 5000,
                };
                this.dialog.open(ErrordialogComponent, {
                    data: data,
                });
                break;
            }
            case 'Signup successful!':
                {
                    const data: SuccessDialogData = {
                        message: authState.message,
                        duration: 2000,
                    };
                    this.dialog.open(SuccessdialogComponent, {
                        data: data,
                    });
                }
                setTimeout(() => {
                    this.dialogRef.close();
                }, 2000);
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
