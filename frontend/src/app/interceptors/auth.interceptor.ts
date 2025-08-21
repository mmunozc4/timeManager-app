import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const session = auth.getSession();

  const authReq = session?.token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${session.token}`,
        },
      })
    : req;

  return next(authReq);
};

