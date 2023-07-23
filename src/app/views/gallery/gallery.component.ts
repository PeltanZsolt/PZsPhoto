import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Photo } from '../../core/models/photo.model';
import { PhotoService } from '../../core/services/photo.service';
import { ErrorDialogData } from '../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../common/errordialog/errordialog.component';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit, OnDestroy {
    category: string;
    photoList: Photo[] = [];
    blobList: any[] = [];
    subscriptions: Subscription[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private photoService: PhotoService,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => {
            this.category = params['category'];
        });
        this.photoService
            .getPhotoListByCategory(this.category)
            .subscribe((res: any) => {
                this.photoList = res;
                if (this.photoList.length === 0) {
                    const data: ErrorDialogData = {
                        messageHeader:
                            'No images uploaded yet in this category.',
                        messageBody: 'Try again later.',
                        duration: 4000,
                    };
                    this.dialog.open(ErrordialogComponent, { data: data });
                    setTimeout(() => {
                        this.router.navigate(['']);
                    }, 2000);
                }
            });
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
