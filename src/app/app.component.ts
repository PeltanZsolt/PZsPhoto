import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    version = environment.version;
    visitorsNr = 0;
    windowScrolled = false;
    connectedClients = 1;

    isAdmin = false;
    isLoggedIn = false;
    menuItems: MenuItem[] = [
        new MenuItem('Login', !this.isLoggedIn, 'openDialog', 'login'),
        new MenuItem('Sign Up', !this.isLoggedIn, 'openDialog', 'signup'),
        new MenuItem('Logout', this.isLoggedIn, 'openDialog', 'logout'),
        new MenuItem('Contact', true, 'navigate', '/contact'),
        new MenuItem('Legal', true, 'navigate', '/legal'),
        new MenuItem('Admin', !this.isAdmin, 'navigate', '/admin'),
    ];


    subscriptions: Subscription[] = [];

    constructor(
        private visitorsService: VisitorsService,
        public dialog: MatDialog,
        private authService: AuthService,
        private socketService: SocketService,
        private router: Router
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
                this.visitorsNr = res.visitorsCount;
            })
        );

        this.subscriptions.push(
            this.authService.authEvent$.subscribe((res) => {
                this.isLoggedIn = res.isLoggedIn;
                this.isAdmin = res.isAdmin;
                this.updateMenuItems(res);
            })
        );

        this.socketService.initSocket();

        this.subscriptions.push(
            this.socketService.socketClientsEvent.subscribe((res) => {
                this.connectedClients = res;
            })
        );
    }

    updateMenuItems(res: any) {
        this.menuItems[0].cond = !res.isLoggedIn;
        this.menuItems[1].cond = !res.isLoggedIn;
        this.menuItems[2].cond = res.isLoggedIn;
        this.menuItems[5].cond = res.isAdmin;
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
