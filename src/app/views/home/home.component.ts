import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, forkJoin, map, switchMap, tap } from 'rxjs';
import { PhotoService } from '../../core/services/photo.service';

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

    constructor(private photoService: PhotoService) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.photoService
                .getCategoriesPartialList()
                .pipe(
                    tap((res) => {
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
                            const blob = res[i] as Blob;
                            const reader = new FileReader();
                            reader.onload = () => {
                                if (res[i].type === 'image/jpeg') {
                                    this.heroesArray[i] = reader.result;
                                }
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
