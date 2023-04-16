import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable()
export class JwtInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    let jwtToken = this.authService.getJwtToken();

    if (jwtToken) {
        const modifiedRequest = req.clone({
          headers: req.headers.append('jwttoken', jwtToken),
        });
        return next.handle(modifiedRequest);
    } else {
        return next.handle(req)
    }
  }
}
