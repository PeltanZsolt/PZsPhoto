import { Component, Inject, AfterContentInit, OnDestroy } from '@angular/core';
import {
    MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
    MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';

@Component({
    selector: 'app-closedialog',
    templateUrl: './errordialog.component.html',
    styleUrls: ['./errordialog.component.scss'],
})
export class ErrordialogComponent implements AfterContentInit, OnDestroy{
    constructor(
        public dialogRef: MatDialogRef<ErrordialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ErrorDialogData
    ) {}

    onOkClick(): void {
        this.dialogRef.close();
    }

    ngAfterContentInit(): void {
        setTimeout(()=> this.dialogRef.close(), this.data.duration)
    }

    ngOnDestroy(): void {
        // TODO: reset background color
    }

}
