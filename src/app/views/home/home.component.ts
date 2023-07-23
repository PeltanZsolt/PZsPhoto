import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, forkJoin, map, switchMap, tap } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';
import { MatDialog } from '@angular/material/dialog';
import { Error404Component } from '../common/error404/error404.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    Object = Object;
    subscriptions: Subscription[] = [];
    categories: string[] = [];
    heroesArray: any[] = [];

    constructor(private photoService: PhotoService, private dialog: MatDialog) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.photoService
                .getCategoriesPartialList()
                .pipe(
                    tap((res) => {
                        if (res.error) {
                            this.dialog.open(Error404Component)
                            return
                        }
                        this.categories = res;
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
                            const blob = new Blob([res[i]], { type: 'image/jpeg' });
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
