import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private username = '';
    private isLoggedIn = false;
    private jwtToken = '';
    private isAdmin = false;

    public authEventEmitter = new EventEmitter();

    getJwtToken(): string {
        return this.jwtToken;
    }

    getAuthVariables() {
        return {
            username: this.username,
            jwtToken: this.jwtToken,
            isLoggedIn: this.isLoggedIn,
            isAdmin: this.isAdmin,
        };
    }

    setAuthVariables(
        username: string,
        jwtToken: string,
        isLoggedIn: boolean,
        isAdmin: boolean
    ): void {
        this.username = username;
        this.jwtToken = jwtToken;
        this.isLoggedIn = isLoggedIn;
        this.isAdmin = isAdmin;

        this.authEventEmitter.emit({
            isLoggedIn: this.isLoggedIn,
            isAdmin: this.isAdmin,
        });
    }

    resetAuthVariables(): void {
        this.username = '';
        this.jwtToken = '';
        this.isLoggedIn = false;
        this.isAdmin = false;

        this.authEventEmitter.emit({
            isLoggedIn: this.isLoggedIn,
            isAdmin: this.isAdmin,
        });
    }
}
