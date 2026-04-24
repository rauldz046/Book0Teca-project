import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserProfile } from './auth.service';

/**
 * Guard genérico. Uso na rota:
 *   { path: '...', canActivate: [permissionGuard(['BIBLIOTECARIO'])] }
 * ADMINISTRADOR sempre passa.
 */
export function permissionGuard(allowed: UserProfile[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isLogged) {
      router.navigate(['/auth/log-in']);
      return false;
    }
    if (auth.hasProfile(allowed)) return true;

    router.navigate(['/home']);
    return false;
  };
}

/** Apenas verifica se há sessão ativa. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isLogged) return true;
  router.navigate(['/auth/log-in']);
  return false;
};
