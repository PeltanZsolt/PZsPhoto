import { EventEmitter, Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Store, createFeatureSelector } from '@ngrx/store';
import { AuthState } from '../store/auth.store/auth.reducer';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    public socketCommentEvent = new EventEmitter();
    public socketClientsEvent = new EventEmitter();
    private socket: any;
    private id: string;
    public connectedClients = 0;

    constructor(
        private store: Store<AuthState>
        ) {
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
                case 'Clients count changed': {
                    this.socketClientsEvent.emit(message.connectedClients);
                    break;
                }
            }
        });
        this.store.select(createFeatureSelector<AuthState>('auth')).subscribe(state => {
            this.socket.disconnect();
            this.socket.auth = {
                auth: { jwttoken: state.user.jwtToken },
            };
            this.socket.connect();
        })
    }

    emitMessage(message: string) {
        this.socket.emit('message', message);
    }

    getSocketId() {
        return this.id;
    }
}
