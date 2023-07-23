import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrordialogComponent } from '../errordialog/errordialog.component';
import { ErrorDialogData } from 'src/app/core/models/error.dialog.data.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss'],
})
export class Error404Component implements OnInit {
    constructor(private dialog: MatDialog, private router: Router) {}

    ngOnInit(): void {
        const data: ErrorDialogData = {
            messageHeader: 'Error 404',
            messageBody: `Requested page doesn't exist.`,
            duration: 5000,
        };
        this.dialog.open(ErrordialogComponent, { data: data });
        setTimeout(() => this.router.navigate(['']), 5000);
    }
}
