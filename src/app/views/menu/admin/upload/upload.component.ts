import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Photo } from '../../../../core/models/photo.model';
import { PhotoService } from '../../../../core/services/photo.service';
import { InputDialogData } from '../../../../core/models/input.dialog.data.model';
import { InputdialogComponent } from '../../../../views/common/inputdialog/inputdialog.component';
import { ErrorDialogData } from '../../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../../../views/common/errordialog/errordialog.component';
import { SuccessDialogData } from '../../../../core/models/success.dialog.data.model';
import { SuccessdialogComponent } from '../../../common/successdialog/successdialog.component';
import { CategoryInputDialogService } from '../../../../core/services/category.input.dialog.service';
import { ExtractExif } from '../../../../core/util/extract.exif';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['../../../../app.component.scss', './upload.component.scss'],
})
export class UploadComponent implements OnInit, OnDestroy {
    selectedFile = new File([], '');
    formGroup: FormGroup;
    title: string;
    category: String;
    description: String;
    year: number;
    place: String;
    subscriptions: Subscription[] = [];
    previewImg: any;
    yearsRange: Number[] = [];
    currentYear: number;
    categories: string[] = [];
    thumbnailBackground = '';

    constructor(
        private photoService: PhotoService,
        private dialog: MatDialog,
        private extractExif: ExtractExif,
        private categoryInputEventService: CategoryInputDialogService
    ) {}

    ngOnInit(): void {
        const thumbnailElement = document.getElementById('thumbnail');
        this.thumbnailBackground = window
            .getComputedStyle(thumbnailElement!)
            .getPropertyValue('background-color');

        this.formGroup = new FormGroup({
            title: new FormControl(this.title, Validators.required),
            category: new FormControl(this.category, Validators.required),
            description: new FormControl(this.description),
            year: new FormControl(this.year, Validators.required),
            place: new FormControl(this.place, Validators.required),
        });

        this.subscriptions.push(
            this.formGroup.valueChanges.subscribe(() => {
                this.title = this.formGroup.controls['title'].value;
                this.category = this.formGroup.controls['category'].value;
                this.description = this.formGroup.controls['description'].value;
                this.year = this.formGroup.controls['year'].value;
                this.place = this.formGroup.controls['place'].value;
            })
        );
        this.currentYear = new Date().getFullYear() as number;
        for (let year = 1900; year <= this.currentYear; year++) {
            this.yearsRange.push(year);
        }

        this.getCategoriesList();

        this.categoryInputEventService.eventEmitter.subscribe(
            (inputEvent: string) => {
                this.getCategoriesList();
                this.formGroup.controls['category'].setValue(inputEvent);
            }
        );
    }

    getCategoriesList() {
        this.subscriptions.push(
            this.photoService.getCategoriesFullList().subscribe((res) => {
                this.categories = res;
            })
        );
    }

    onFileChange(event: any) {
        if (event.target.files[0]) {
            this.selectedFile = event.target.files[0];

            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onloadend = (e) => {
                if (e.target && e.target.result) {
                    this.previewImg = e.target.result;
                }
            };
        }

        this.extractExif.getYear(this.selectedFile).subscribe((res: string) => {
            this.formGroup.controls['year'].setValue(Number(res));
        });
    }

    onCreateNewCategory() {
        const data: InputDialogData = {
            messageHeader: 'Create new category ',
        };
        this.dialog.open(InputdialogComponent, { data: data });
    }

    onUploadPhoto() {
        if (this.selectedFile) {
            const photoAttributes: Photo = {
                filename: this.selectedFile.name,
                title: this.formGroup.controls['title'].value,
                category: this.formGroup.controls['category'].value,
                description: this.formGroup.controls['description'].value,
                year: this.formGroup.controls['year'].value,
                place: this.formGroup.controls['place'].value,
                viewsNr: 0,
                averageRating: 0,
            };

            const subscription = this.photoService
                .uploadPhoto(this.selectedFile, photoAttributes)
                .subscribe((res) => {
                    if (res.error) {
                        const dialogData: ErrorDialogData = {
                            messageHeader: 'Access forbidden',
                            messageBody: 'You are not authorized to upload.',
                            duration: 1500,
                        };
                        this.dialog.open(ErrordialogComponent, {
                            data: dialogData,
                        });
                        return console.log(res.error);
                    }

                    const dialogData: SuccessDialogData = {
                        message: res.message,
                        duration: 1000,
                    };
                    this.dialog.open(SuccessdialogComponent, {
                        data: dialogData,
                    });

                    this.resetInputFields();
                });
            this.subscriptions.push(subscription);
        }
    }

    resetInputFields() {
        this.formGroup.reset();
        this.selectedFile = new File([], '');
        this.previewImg = null;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }
}
