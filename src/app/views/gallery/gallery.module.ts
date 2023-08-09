import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriesComponent } from './galleries/galleries.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CarouselComponent } from './carousel/carousel.component';
import { ImageElementComponent } from './img.el/imageelement.component';
import { RatingComponent } from './rating/rating.component';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { TranslateModule } from '@ngx-translate/core';

import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { StoreModule } from '@ngrx/store';
import { GalleryReducer, GalleryState } from 'src/app/core/store/gallery.store/gallery.reducers';
import { EffectsModule } from '@ngrx/effects';
import { GalleryEffects } from 'src/app/core/store/gallery.store/gallery.effects';

@NgModule({
    declarations: [
        GalleriesComponent,
        GalleryComponent,
        CarouselComponent,
        ImageElementComponent,
        RatingComponent,
    ],
    imports: [
        CommonModule,
        AppRoutingModule,

        MatInputModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule,

        ReactiveFormsModule,
        TranslateModule.forChild(),

        StoreModule.forFeature<GalleryState>('gallery', GalleryReducer),
        EffectsModule.forFeature([GalleryEffects])
        ],
    exports: [
        GalleriesComponent,
        GalleryComponent,
        CarouselComponent,
        ImageElementComponent,
        RatingComponent,
    ],
})
export class GalleryModule {}
