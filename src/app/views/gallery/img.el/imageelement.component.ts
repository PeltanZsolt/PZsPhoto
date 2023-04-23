import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { PhotoService } from '../../../core/services/photo.service';

@Component({
    selector: 'app-imageelement',
    templateUrl: './imageelement.component.html',
    styleUrls: ['./imageelement.component.scss'],
})
export class ImageElementComponent implements OnInit {
    @Input() id: string;
    photo: any;
    isLoaded = false;
    loadInAdvance = 1000;

    subscriptions: Subscription[] = [];

    constructor(private photoService: PhotoService) {}

    ngOnInit(): void {
        if (!this.isLoaded && this.checkVisible()) {
            this.loadPhoto();
        } else if (!this.isLoaded) {
            document.addEventListener('scroll', () => {
                this.onScroll();
            });
        }
    }

    loadPhoto() {
        this.subscriptions.push(
            this.photoService
                .getPhotoBlob(Number(this.id))
                .subscribe((res: any) => {
                    const reader = new FileReader();
                    const blob = res as Blob;
                    reader.onload = () => {
                        this.photo = reader.result;
                        this.isLoaded = true;
                    };
                    reader.readAsDataURL(blob);
                })
        );
    }

    onScroll() {
        if (!this.isLoaded && this.checkVisible()) {
            this.loadPhoto();
        }
    }

    checkVisible() {
        const top = document
            .getElementById(this.id)
            ?.getBoundingClientRect().top;
        return window.innerHeight > top! - this.loadInAdvance;
    }

    ngOnDestroy() {
        window.removeEventListener('scroll', () => {});
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
