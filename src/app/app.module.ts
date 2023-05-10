import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    HttpClientModule,
    HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { ContactComponent } from './views/menu/contact/contact.component';
import { LogoutdialogComponent } from './views/common/closedialog/logoutdialog.component';
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
        LogoutdialogComponent,
        ErrordialogComponent,
        SuccessdialogComponent,
        Error404Component,
        InputdialogComponent,
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
