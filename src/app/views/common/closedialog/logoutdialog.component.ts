import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-closedialog',
    templateUrl: './logoutdialog.component.html',
    styleUrls: ['./logoutdialog.component.scss'],
})
export class LogoutdialogComponent {
    constructor(
        public dialogRef: MatDialogRef<LogoutdialogComponent>,
        private router: Router,
        private authService: AuthService,
        @Inject(MAT_DIALOG_DATA) public data: null
    ) {}

    onNoClick(): void {
        this.dialogRef.close();
    }
    onOkClick(): void {
        this.dialogRef.close();
        this.router.navigate(['/']);
        this.authService.resetAuthVariables()
    }
}
