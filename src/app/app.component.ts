import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { VisitorsService } from './core/services/visitors.services';
import { AuthService } from './core/services/auth.service';
import { LogoutdialogComponent } from './views/common/closedialog/logoutdialog.component';
import { SocketService } from './core/services/socket.service';
import { SuccessdialogComponent } from './views/common/successdialog/successdialog.component';

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
        private socketService: SocketService
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
        window.addEventListener('keypress', (event) => {console.log(event)
        if (event.code === "KeyR") {
            let hostIpAddress = 'noIpAddressYet';
            this.visitorsService.getHostIP().subscribe(res => {
                console.log('host ip: ', res)
                const data = {message: 'no ip address yet', duration: 2000}
                this.dialog.open(SuccessdialogComponent, {data});
            })
        }})

        this.subscriptions.push(
            this.visitorsService.getVisitorsNumber().subscribe((res) => {
                this.visitorsNr = res.visitorsCount;
            })
        );

        this.subscriptions.push(
            this.authService.authEvent$.subscribe((res) => {
                this.isLoggedIn = res.isLoggedIn;
                this.isAdmin = res.isAdmin;
            })
        );

        this.socketService.initSocket()
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
