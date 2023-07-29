import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatDividerModule} from '@angular/material/divider';


import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { ContactComponent } from './views/menu/contact/contact.component';
import { LogoutComponent } from './views/menu/logout/logout.component';
import { UploadComponent } from './views/menu/admin/upload/upload.component';
import { StatisticsComponent } from './views/menu/admin/statistics/statistics.component';
import { UsersComponent } from './views/menu/admin/users/users.component';
import { GalleryComponent } from './views/gallery/gallery.component';
import { CarouselComponent } from './views/gallery/carousel/carousel.component';
import { ImageElementComponent } from './views/gallery/img.el/imageelement.component';
import { RatingComponent } from './views/gallery/rating/rating.component';
import { SuccessdialogComponent } from './views/common/successdialog/successdialog.component';
import { InputdialogComponent } from './views/common/inputdialog/inputdialog.component';
import { ErrordialogComponent } from './views/common/errordialog/errordialog.component';
import { Error404Component } from './views/common/error404/error404.component';

import { AuthGuardService } from './core/services/auth-guard.service';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { VisitorsService } from './core/services/visitors.services';
import { PhotoService } from './core/services/photo.service';
import { ViewsService } from './core/services/views.services';
import { CommentService } from './core/services/comment.service';
import { JwtInterceptorService } from './core/services/jwt-interceptor.service';
import { SocketService } from './core/services/socket.service';
import { LegalComponent } from './views/menu/legal/legal.component';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {authReducer} from './core/auth.store/auth.reducer'
import { AuthEffects } from './core/auth.store/auth.effects';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        UploadComponent,
        GalleryComponent,
        CarouselComponent,
        ImageElementComponent,
        RatingComponent,
        ContactComponent,
        LoginComponent,
        SignupComponent,
        UsersComponent,
        StatisticsComponent,
        LogoutComponent,
        ErrordialogComponent,
        SuccessdialogComponent,
        Error404Component,
        InputdialogComponent,
        LegalComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,

        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSelectModule,
        MatRadioModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatButtonToggleModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatMenuModule,
        MatToolbarModule,
        MatDividerModule,
        StoreModule.forRoot({auth: authReducer},{}),
        EffectsModule.forRoot([AuthEffects])
    ],
    providers: [
        VisitorsService,
        PhotoService,
        CommentService,
        UserService,
        AuthService,
        ViewsService,
        AuthGuardService,
        SocketService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptorService,
            multi: true,
            deps: [AuthService],
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
