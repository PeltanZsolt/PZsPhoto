import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, tap,  switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Photo } from '../../../core/models/photo.model';
import { ErrorDialogData } from '../../../core/models/error.dialog.data.model';
import { ErrordialogComponent } from '../../common/errordialog/errordialog.component';
import { GalleryState } from 'src/app/core/store/gallery.store/gallery.reducers';
import { Store, createFeatureSelector } from '@ngrx/store';
import * as GalleryActions from '../../../core/store/gallery.store/gallery.actions';

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
        private dialog: MatDialog,
        private galleryStore: Store<GalleryState>
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.route.params
                .pipe(
                    tap(
                        (params: Params) => (this.category = params['category'])
                    ),
                    switchMap(()=>{
                        return this.galleryStore
                        .select(createFeatureSelector<GalleryState>('gallery'))
                    }),
                    tap((state: GalleryState) => {
                        const filteredlist = state.gallery.filter(
                            (galleryByCategory) =>
                                galleryByCategory.category === this.category
                        );
                        if (filteredlist && filteredlist[0]) {
                            this.photoList = filteredlist[0].photosByCategory;
                            if (this.photoList.length === 0) {
                                const data: ErrorDialogData = {
                                    messageHeader:
                                        'No images uploaded yet in this category.',
                                    messageBody: 'Try again later.',
                                    duration: 4000,
                                };
                                this.dialog.open(ErrordialogComponent, {
                                    data: data,
                                });
                                setTimeout(() => {
                                    this.router.navigate(['']);
                                }, 2000);
                            }
                        } else {
                            this.galleryStore.dispatch(
                            GalleryActions.FetchCategoryStart({
                                category: this.category,
                            })
                        );
                        }
                    })
                )
                .subscribe()
        );
     }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
