import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { DialogRef } from '@angular/cdk/dialog';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../core/auth.store/auth.actions';

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
        private userService: UserService,
        private dialog: MatDialog,
        private dialogRef: DialogRef,
        private authService: AuthService,
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
            this.store.subscribe((state: any) => {
                this.handleLoginResponse(state.auth);
            })
        );
    }

    onLogin() {
        this.username = this.formGroup.controls['username'].value;
        this.password = this.formGroup.controls['password'].value;
        const user = new User(this.username, this.password);
        this.store.dispatch(AuthActions.LoginStart({ user }));
        // this.subscriptions.push(
        //     this.userService
        //         .login(user)
        //         .pipe(
        //             tap((res) => {
        //                 this.handleLoginResponse(res);
        //             })
        //         )
        //         .subscribe()
        // );
    }

    handleLoginResponse(res: any): void {
        if (res.authErrorState.hasError) {
            switch (res.authErrorState.message) {
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
        } else if (res.user.username) {
            const data: SuccessDialogData = {
                message: res.authErrorState.message,
                duration: 2000,
            };
            this.dialog.open(SuccessdialogComponent, {
                data: data,
            });

            // this.authService.setAuthVariables(
            //     this.username,
            //     res.jwtToken,
            //     true,
            //     res.isAdmin
            // );
            setTimeout(() => this.dialogRef.close(), 2000);
        }

        // switch (res.message) {
        //     case `Invalid username.`: {
        //         const data: ErrorDialogData = {
        //             messageHeader: res.message,
        //             messageBody: `Username doesn't exist. Check username or sign up as a new user.`,
        //             duration: 5000,
        //         };
        //         this.dialog.open(ErrordialogComponent, {
        //             data: data,
        //         });
        //         break;
        //     }
        //     case `Incorrect password`: {
        //         const data: ErrorDialogData = {
        //             messageHeader: 'Incorrect username or password',
        //             messageBody: `Check your credentials.`,
        //             duration: 5000,
        //         };
        //         this.dialog.open(ErrordialogComponent, {
        //             data: data,
        //         });
        //         break;
        //     }
        //     case `Login successful`: {
        //         const data: SuccessDialogData = {
        //             message: res.message,
        //             duration: 2000,
        //         };
        //         this.dialog.open(SuccessdialogComponent, {
        //             data: data,
        //         });

        //         this.authService.setAuthVariables(
        //             this.username,
        //             res.jwtToken,
        //             true,
        //             res.isAdmin
        //         );
        //         setTimeout(() => this.dialogRef.close(), 2000);
        //         break;
        //     }
        //     default: {
        //         const data: ErrorDialogData = {
        //             messageHeader: 'Error',
        //             messageBody: `Something went wrong. Tray again later.`,
        //             duration: 5000,
        //         };
        //         this.dialog.open(ErrordialogComponent, {
        //             data: data,
        //         });
        //     }
        // }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
