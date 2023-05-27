import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root',
})
export class SocketService {
    public socketEventEmitter = new EventEmitter();
    private socket: any;
    private id: string;

    constructor(private authService: AuthService) {
        this.socket = io(environment.apiUrl);
    }

    initSocket() {
        this.socket.on('connect', () => {
            this.id = this.socket.id;
        });
        this.socket.on('message', (message: string) => {
            this.socketEventEmitter.emit(message);
        });
        this.authService.authEvent$.subscribe(() => {
            this.socket.disconnect();
            this.socket.auth = {
                auth: { jwttoken: this.authService.getJwtToken() },
            };
            this.socket.connect();
        });
    }

    emitMessage(message: string) {
        this.socket.emit('message', message);
    }

    getSocketId() {
        return this.id;
    }
}
