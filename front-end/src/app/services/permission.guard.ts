import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, UserProfile } from './auth.service';
import { AlertService } from '../utils/toast-alert-service.service';

/**
 * Guard genérico para verificação de perfil.
 * Uso na rota:
 *   { path: '...', canActivate: [permissionGuard(['BIBLIOTECARIO'])] }
 *
 * Comportamento:
 *  - Sem sessão  → redireciona para /auth/log-in (sem alerta, fluxo natural)
 *  - Sem permissão → exibe SweetAlert "Acesso negado" e redireciona para /home
 *  - ADMINISTRADOR sempre passa (regra do AuthService.hasProfile)
 *
 * TC-RBAC-06: o feedback visual é parte do critério de aceite ("redireciona/erro").
 */
export function permissionGuard(allowed: UserProfile[]): CanActivateFn {
  return (route) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const alert = inject(AlertService);

    if (!auth.isLogged) {
      router.navigate(['/auth/log-in']);
      return false;
    }
    if (auth.hasProfile(allowed)) return true;

    // Feedback obrigatório (TC-RBAC-06). Erro é mais visível que info,
    // alinhado ao tom de "operação negada".
    const titulo = (route.data && (route.data['titulo'] as string)) || 'esta área';
    alert.error(
      'Acesso negado',
      `Seu perfil não tem permissão para acessar ${titulo}.`
    );
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
