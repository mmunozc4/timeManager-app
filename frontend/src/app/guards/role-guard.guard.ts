import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const RoleGuard = (requiredRole: 'client' | 'business'): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const session = auth.getSession();

    if (session?.role === requiredRole) return true;

    router.navigate(['auth/login']);
    return false;
  };
};
