import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotoService } from 'src/app/core/services/photo.service';
import {
    map,
    Observable,
    of,
    Subscription,
    switchMap,
    concatMap,
    zip,
    concatAll,
} from 'rxjs';
import { Photo } from 'src/app/core/models/photo.model';

@Component({
    selector: 'app-files.backup',
    templateUrl: './files.backup.component.html',
    styleUrls: ['./files.backup.component.scss'],
})
export class FilesBackupComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];

    constructor(private photoService: PhotoService) {}
    ngOnInit() {
        this.photoService
            .getCategoriesPartialList()
            .pipe(
                switchMap((categories) => {
                    const photosByCategory$: Observable<Photo>[] = [];
                    categories.forEach((category: string) => {
                        photosByCategory$.push(
                            this.photoService.getPhotoListByCategory(category)
                        );
                    });
                    return zip(...photosByCategory$);
                }),
                map((photosByCategory: Photo[]) => photosByCategory.flat()),
                concatMap((allPhotos) => {
                    return allPhotos.map((photo) =>
                        zip(
                            of(photo),
                            this.photoService.getPhotoBlob(Number(photo.id))
                        )
                    );
                }),
                concatAll(),
                switchMap((res) => {
                    const file = new File([res[1]], res[0].filename);
                    const photo: Photo = res[0];
                    return this.photoService.saveFileLocally(file, photo);
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
