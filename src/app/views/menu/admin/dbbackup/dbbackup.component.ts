import { Component, OnInit, OnDestroy } from '@angular/core';
import { tap, switchMap, Observable, forkJoin, Subscription } from 'rxjs';
import { PhotoService } from 'src/app/core/services/photo.service';

@Component({
    selector: 'app-dbbackup',
    templateUrl: './dbbackup.component.html',
    styleUrls: ['./dbbackup.component.scss'],
})
export class DbbackupComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    constructor(private photoService: PhotoService) {}

    ngOnInit() {
        const tablesArray: Observable<any>[] = [];
        let tableNames: string[] = [];
        this.photoService
            .showTables()
            .pipe(
                tap((res) => {
                    tableNames = res;
                }),
                switchMap((res) => {
                    for (let tableName of res) {
                        tablesArray.push(
                            this.photoService.getTableRows(tableName)
                        );
                    }
                    return forkJoin(tablesArray);
                }),
                switchMap((res) => {
                    const tablesObservable: Observable<any>[] = [];
                    for (let [index, tableName] of tableNames.entries()) {
                        tablesObservable.push(
                            this.photoService.postTableRows(
                                tableName,
                                res[index]
                            )
                        );
                    }
                    return forkJoin(tablesObservable);
                })
            )
            .subscribe();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
