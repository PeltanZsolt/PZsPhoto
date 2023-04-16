import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class CategoryInputDialogService {
    public eventEmitter = new EventEmitter();

    updateCategoryList(category: string): void {
        this.eventEmitter.emit(category);
    }
}
