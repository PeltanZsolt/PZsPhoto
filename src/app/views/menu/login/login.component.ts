import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { SuccessdialogComponent } from '../../common/successdialog/successdialog.component';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';

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
        private router: Router,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            username: new FormControl(this.username, Validators.required),
            password: new FormControl(this.password, Validators.required),
        });
    }

    onLogin() {
        this.username = this.formGroup.controls['username'].value;
        this.password = this.formGroup.controls['password'].value;
        const user: User = {
            username: this.username,
            password: this.password,
        };
        this.subscriptions.push(
            this.userService
                .login(user)
                .pipe(
                    tap((res) => {
                        this.handleLoginResponse(res);
                    })
                )
                .subscribe()
        );
    }

    handleLoginResponse(res: any): void {
        switch (res.message) {
            case `User doesn't exists!`: {
                const data: ErrorDialogData = {
                    messageHeader: res.message,
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
            case `Login successful`: {
                const data: SuccessDialogData = {
                    message: res.message,
                    duration: 2000,
                };
                this.dialog.open(SuccessdialogComponent, {
                    data: data,
                });
                this.authService.setAuthVariables(
                    this.username,
                    res.jwtToken,
                    true,
                    res.isAdmin
                );
                setTimeout(() => this.router.navigate(['']), 1500);
            }
        }
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
