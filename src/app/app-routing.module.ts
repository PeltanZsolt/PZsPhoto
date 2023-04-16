import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './views/menu/admin/upload/upload.component';
import { CarouselComponent } from './views/gallery/carousel/carousel.component';
import { GalleryComponent } from './views/gallery/gallery.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { ContactComponent } from './views/menu/contact/contact.component';
import { UsersComponent } from './views/menu/admin/users/users.component';
import { StatisticsComponent } from './views/menu/admin/statistics/statistics.component';
import { Error404Component } from './views/common/error404/error404.component';
import { AuthGuardService } from './core/services/auth-guard.service';

const appRouting: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'upload', component: UploadComponent, canActivate:[AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate:[AuthGuardService] },
  { path: 'statistics', component: StatisticsComponent, canActivate:[AuthGuardService] },
  { path: 'gallery/:category', component: GalleryComponent },
  { path: 'gallery/:category/:id', component: CarouselComponent },
  { path: '*', component: HomeComponent },

  { path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(appRouting)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
