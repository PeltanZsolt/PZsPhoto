import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessDialogData } from '../../../core/models/success.dialog.data.model';

@Component({
    selector: 'app-successialog',
    templateUrl: './successdialog.component.html',
    styleUrls: ['./successdialog.component.scss'],
})
export class SuccessdialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<SuccessdialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: SuccessDialogData
    ) {}

    ngOnInit() {
        setTimeout(() => {
            this.dialogRef.close();
        }, this.data.duration);
    }
    onOkClick(): void {
        this.dialogRef.close();
    }
}
