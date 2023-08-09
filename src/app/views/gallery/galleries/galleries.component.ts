import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, forkJoin, map, switchMap, tap } from 'rxjs';
import { PhotoService } from '../../../core/services/photo.service';
import { MatDialog } from '@angular/material/dialog';
import { Error404Component } from '../../common/error404/error404.component';
import { Store, createFeatureSelector } from '@ngrx/store';
import { GalleryState } from 'src/app/core/store/gallery.store/gallery.reducers';
import * as GalleryActions from '../../../core/store/gallery.store/gallery.actions';

@Component({
    selector: 'app-home',
    templateUrl: './galleries.component.html',
    styleUrls: ['./galleries.component.scss'],
})
export class GalleriesComponent implements OnInit, OnDestroy {
    Object = Object;
    subscriptions: Subscription[] = [];
    categories: string[] = [];
    heroesArray: any[] = [];

    constructor(
        private photoService: PhotoService,
        private dialog: MatDialog,
        private galleryStore: Store<GalleryState>
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.galleryStore
                .select(createFeatureSelector<GalleryState>('gallery'))
                .pipe(
                    tap((state) => {
                        if (state.galleryStateError.hasError) {
                            this.dialog.open(Error404Component);
                        } else if (state.categories.length > 0) {
                            this.categories = state.categories;
                        } else {
                            this.galleryStore.dispatch(
                                GalleryActions.FetchCategoriesStart()
                            );
                        }
                    }),
                    switchMap(() => {
                        const heroes$: Observable<ArrayBuffer>[] = [];
                        for (let [i, category] of this.categories.entries()) {
                            heroes$[i] =
                                this.photoService.getHeroPhotoByCategory(
                                    category
                                );
                        }
                        return forkJoin(heroes$);
                    }),
                    map((res: any) => {
                        for (let i = 0; i < this.categories.length; i++) {
                            const blob = new Blob([res[i]], {
                                type: 'image/jpeg',
                            });
                            const reader = new FileReader();
                            reader.onload = () => {
                                this.heroesArray[i] = reader.result?.toString();
                            };
                            reader.readAsDataURL(blob);
                        }
                    })
                )
                .subscribe()
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }
}
