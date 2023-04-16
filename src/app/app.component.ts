import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { VisitorsService } from './core/services/visitors.services';
import { AuthService } from './core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LogoutdialogComponent } from './views/common/closedialog/logoutdialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    visitorsNr = 0;
    windowScrolled = false;

    isAdmin = false;
    isLoggedIn = false;

    subscriptions: Subscription[] = [];

    constructor(
        private visitorsService: VisitorsService,
        public dialog: MatDialog,
        private authService: AuthService,
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
            this.authService.authEventEmitter.subscribe((res) => {
                this.isLoggedIn = res.isLoggedIn;
                this.isAdmin = res.isAdmin;
            })
        );
    }

    onScrollToTop() {
        window.scrollTo(0, 0);
    }

    openLogoutDialog(): void {
        this.dialog.open(LogoutdialogComponent, {});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }
}
