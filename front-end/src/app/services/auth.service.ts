import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserProfile =
  | 'LEITOR'
  | 'BIBLIOTECARIO'
  | 'FINANCEIRO'
  | 'ESTOQUE'
  | 'ADMINISTRADOR';

const STORAGE_KEY = 'infoSessao';

// Mapeia idPerfilFuncionarios (string) -> UserProfile
const PERFIL_MAP: Record<string, UserProfile> = {
  '1': 'ADMINISTRADOR',
  '2': 'BIBLIOTECARIO',
  '3': 'FINANCEIRO',
  '4': 'ESTOQUE',
  '5': 'LEITOR',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSubject = new BehaviorSubject<any>(this.readStorage());
  session$ = this.sessionSubject.asObservable();

  private profileSubject = new BehaviorSubject<UserProfile | null>(
    this.derivarPerfil(this.sessionSubject.value),
  );
  profile$: Observable<UserProfile | null> = this.profileSubject.asObservable();

  get session(): any {
    return this.sessionSubject.value;
  }

  get profile(): UserProfile | null {
    return this.profileSubject.value;
  }

  get isLogged(): boolean {
    return !!this.sessionSubject.value;
  }

  setSession(info: any): void {
    if (info) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    this.sessionSubject.next(info);
    this.profileSubject.next(this.derivarPerfil(info));
  }

  logout(): void {
    this.setSession(null);
  }

  /**
   * Retorna true se o perfil atual está em `allowed`.
   * ADMINISTRADOR sempre tem acesso.
   */
  hasProfile(allowed: UserProfile[]): boolean {
    const p = this.profile;
    if (!p) return false;
    if (p === 'ADMINISTRADOR') return true;
    return allowed.includes(p);
  }

  private readStorage(): any {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private derivarPerfil(info: any): UserProfile | null {
    if (!info) return null;

    // Funcionário: tem idPerfilFuncionarios
    const idPerfil = info.idPerfilFuncionarios;
    if (idPerfil != null) {
      return PERFIL_MAP[String(idPerfil)] ?? 'LEITOR';
    }

    // Caso venha como nome direto
    if (typeof info.perfil === 'string' && PERFIL_MAP[info.perfil]) {
      return PERFIL_MAP[info.perfil];
    }

    // Cliente (usuário comum) - não tem perfil de funcionário
    return 'LEITOR';
  }
}
