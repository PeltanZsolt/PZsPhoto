import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, debounceTime, tap, startWith } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { AuthService } from '../../../core/services/auth.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
    formGroup: FormGroup;
    username: string;
    password: string;
    passwordVerify: string;
    user: User;
    generatedPassword: string;
    hide = false;

    subscriptions: Subscription[] = [];

    constructor(
        private userService: UserService,
        private dialog: MatDialog,
        private authService: AuthService,
        private dialogRef: DialogRef
    ) {}

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            username: new FormControl(this.username, Validators.required),
            password: new FormControl(this.password, Validators.required),
            passwordVerify: new FormControl(
                this.passwordVerify,
                Validators.required
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
                    })
                )
                .subscribe()
        );
        this.generatePassword();
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
        this.userService.signUp(this.user).subscribe((res) => {
            this.handleSignupResponse(res);
        });
    }

    handleSignupResponse(res: any): void {
        switch (res.message) {
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
                    messageHeader: res.message,
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
                        message: res.message,
                        duration: 2000,
                    };
                    this.dialog.open(SuccessdialogComponent, {
                        data: data,
                    });
                }
                setTimeout(() => {
                    this.dialogRef.close();
                }, 2000);
                this.authService.setAuthVariables(
                    this.username,
                    res.jwtToken,
                    true,
                    false
                );
        }
    }
}
