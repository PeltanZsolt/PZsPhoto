import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, map, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { MenuItem } from './core/models/menu-item';
import { VisitorsService } from './core/services/visitors.services';
import { AuthService } from './core/services/auth.service';
import { SocketService } from './core/services/socket.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutComponent } from './views/menu/logout/logout.component';
import { LoginComponent } from './views/menu/login/login.component';
import { SignupComponent } from './views/menu/signup/signup.component';
import { Store, createFeatureSelector } from '@ngrx/store';
import { User } from './core/models/user.model';
import { AuthState } from './core/auth.store/auth.reducer';

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

    // isAdmin = false;
    // isLoggedIn = false;
    // username = '';
    // username$: any;
    // user: any;
    // state$: any;
    userState$: Observable<User>;
    menuItems: MenuItem[] = [];

    subscriptions: Subscription[] = [];

    constructor(
        private visitorsService: VisitorsService,
        public dialog: MatDialog,
        private authService: AuthService,
        private socketService: SocketService,
        private router: Router,
        private store: Store<AuthState>
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
        // window.addEventListener('beforeunload', function (event) {
        //     var confirmationMessage = 'o/';
        //     event.returnValue = confirmationMessage;
        //     return confirmationMessage;
        // });

        this.subscriptions.push(
            this.visitorsService.getVisitorsNumber().subscribe((res) => {
                this.visitorsCount = res.visitorsCount;
            })
        );

        this.userState$ = this.store
            .select(createFeatureSelector<AuthState>('auth'))
            .pipe(map((state) => state.user));

        this.menuItems = [
            new MenuItem(
                'Login',
                this.userState$.pipe(map((state) => !state.username)),
                'openDialog',
                'login'
            ),
            new MenuItem(
                'Sign Up',
                this.userState$.pipe(map((state) => !state.username)),
                'openDialog',
                'signup'
            ),
            new MenuItem(
                'Logout',
                this.userState$.pipe(map((state) => !!state.username)),
                'openDialog',
                'logout'
            ),
            new MenuItem('Contact', of(true), 'navigate', '/contact'),
            new MenuItem('Legal', of(true), 'navigate', '/legal'),
            new MenuItem(
                'Admin',
                this.userState$.pipe(map((state) => state.isAdmin!)),
                'navigate',
                '/admin'
            ),
        ];

        this.socketService.initSocket();

        this.subscriptions.push(
            this.socketService.socketClientsEvent.subscribe((res) => {
                this.connectedClientsCount = res;
            })
        );
    }

    // updateMenuItems(res: any) {
    //     this.menuItems[0].cond = !res.isLoggedIn;
    //     this.menuItems[1].cond = !res.isLoggedIn;
    //     this.menuItems[2].cond = res.isLoggedIn;
    //     this.menuItems[5].cond = res.isAdmin;
    // }

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
                    this.dialog.open(LoginComponent, {
                        width: '560px',
                    });
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

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
