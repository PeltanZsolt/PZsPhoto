import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    public socketCommentEvent = new EventEmitter();
    public socketClientsEvent = new EventEmitter();
    private socket: any;
    private id: string;
    public connectedClients = 0;

    constructor(private authService: AuthService) {
        this.socket = io(environment.apiUrl);
    }

    initSocket() {
        this.socket.on('connect', () => {
            this.id = this.socket.id;
        });
        this.socket.on('message', (message: any) => {
            switch (message.messageSubject) {
                case 'New comment posted': {
                    this.socketCommentEvent.emit(message.newComment);
                    break;
                }
                case 'Clients number changed': {
                    this.socketClientsEvent.emit(message.connectedClients);
                    break;
                }
            }
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
