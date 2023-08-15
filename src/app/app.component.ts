import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { MenuItem } from './core/models/menu-item';
import { VisitorsService } from './core/services/visitors.services';
import { SocketService } from './core/services/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from './views/menu/logout/logout.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { Store, createFeatureSelector } from '@ngrx/store';
import { User } from './core/models/user.model';
import { AuthState } from './core/store/auth.store/auth.reducer';

import { TranslateState } from './core/store/translate.store/translate.reducer';
import * as translateActions from './core/store/translate.store/translate.actions';
import { locales } from './core/models/locales.model';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    version = environment.version;
    visitorsCount = 0;
    windowScrolled = false;
    connectedClientsCount = 1;

    userState$: Observable<User>;
    menuItems: MenuItem[] = [];

    locales = locales;
    languageIndex: number;

    subscriptions: Subscription[] = [];

    constructor(
        private visitorsService: VisitorsService,
        public dialog: MatDialog,
        private socketService: SocketService,
        private router: Router,
        private authStore: Store<AuthState>,
        private translateStore: Store<TranslateState>
    ) {}

    @HostListener('window:scroll', [])
    onWindowScroll() {
        if (document.documentElement.scrollTop > 0) {
            this.windowScrolled = true;
        } else {
            this.windowScrolled = false;
        }
    }

    ngOnInit() {
        window.addEventListener('beforeunload', function (event) {
            var confirmationMessage = 'o/';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        });

        this.subscriptions.push(
            this.visitorsService.getVisitorsNumber().subscribe((res) => {
                this.visitorsCount = res.visitorsCount;
            })
        );

        this.userState$ = this.authStore
            .select(createFeatureSelector<AuthState>('auth'))
            .pipe(map((state) => state.user));

        // prettier-ignore
        this.menuItems = [
            new MenuItem('Login', this.userState$.pipe(map((state) => !state.username)), 'openDialog', 'login' ),
            new MenuItem('SignUp', this.userState$.pipe(map((state) => !state.username)), 'openDialog', 'signup'),
            new MenuItem('Logout', this.userState$.pipe(map((state) => !!state.username)), 'openDialog', 'logout' ),
            new MenuItem('Contact', of(true), 'navigate', '/contact'),
            new MenuItem('Legal', of(true), 'navigate', '/legal'),
        ];

        this.socketService.initSocket();

        this.subscriptions.push(
            this.socketService.socketClientsEvent.subscribe((res) => {
                this.connectedClientsCount = res;
            })
        );
        this.translateStore.dispatch(
            translateActions.LanguageChangeStart({
                languageIndex: 0,
                languageCode: locales[0].lang,
            })
        );

        this.subscriptions.push(
            this.translateStore
                .select(createFeatureSelector<TranslateState>('translate'))
                .subscribe((state: TranslateState) => {
                    this.languageIndex = state.languageIndex;
                })
        );
    }

    onScrollToTop() {
        window.scrollTo(0, 0);
    }

    handleMenuItemClick(action: string, route: string): void {
        if (action === 'navigate') {
            this.router.navigate([route]);
            return;
        } else {
            switch (route) {
                case 'login': {
                    this.dialog.open(LoginComponent, { width: '560px' });
                    break;
                }
                case 'signup': {
                    this.dialog.open(SignupComponent, { minWidth: 560 });
                    break;
                }
                case 'logout': {
                    this.dialog.open(LogoutComponent, {});
                    break;
                }
            }
        }
    }

    handleAdminMenuItemClick() {}

    onChangeLanguage(index: number) {
        this.translateStore.dispatch(
            translateActions.LanguageChangeStart({
                languageIndex: index,
                languageCode: locales[index].lang,
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
