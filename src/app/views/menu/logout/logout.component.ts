import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-logoutdialog',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent {
    constructor(
        public dialogRef: MatDialogRef<LogoutComponent>,
        private router: Router,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data: null
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
    onOkClick(): void {
        this.dialogRef.close();
        if (this.authService.getAuthVariables().isAdmin) {
            this.router.navigate(['/']);
        }
        this.authService.resetAuthVariables()
    }
}
