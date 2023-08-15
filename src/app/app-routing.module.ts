import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GalleriesComponent } from './views/gallery/galleries/galleries.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { ContactComponent } from './views/menu/contact/contact.component';
import { UploadComponent } from './views/menu/admin/upload/upload.component';
import { UsersComponent } from './views/menu/admin/users/users.component';
import { StatisticsComponent } from './views/menu/admin/statistics/statistics.component';
import { CarouselComponent } from './views/gallery/carousel/carousel.component';
import { GalleryComponent } from './views/gallery/gallery/gallery.component';
import { Error404Component } from './views/common/error404/error404.component';
import { AuthGuardService } from './core/services/auth-guard.service';
import { LegalComponent } from './views/menu/legal/legal.component';
import { DbbackupComponent } from './views/menu/admin/dbbackup/dbbackup.component';
import { FilesBackupComponent } from './views/menu/admin/files.backup/files.backup.component';

const appRouting: Routes = [
  { path: '', pathMatch: 'full', component: GalleriesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'legal', component: LegalComponent },
  { path: 'admin', component: UploadComponent, canActivate:[AuthGuardService] },
  { path: 'upload', component: UploadComponent, canActivate:[AuthGuardService] },
  { path: 'dbbackup', component: DbbackupComponent, canActivate:[AuthGuardService] },
  { path: 'filesbackup', component: FilesBackupComponent, canActivate:[AuthGuardService] },
  { path: 'users', component: UsersComponent, canActivate:[AuthGuardService] },
  { path: 'statistics', component: StatisticsComponent, canActivate:[AuthGuardService] },
  { path: 'gallery/:category', component: GalleryComponent },
  { path: 'gallery/:category/:id', component: CarouselComponent },
  { path: '*', component: GalleriesComponent },

  { path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(appRouting)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
