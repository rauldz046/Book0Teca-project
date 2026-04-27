import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { permissionGuard, authGuard } from './permission.guard';
import { AuthService } from './auth.service';
import { AlertService } from '../utils/toast-alert-service.service';

/**
 * Specs do permissionGuard — cobre TC-RBAC-01 a TC-RBAC-06 do ponto de vista lógico.
 * Validação de UI (badge, item de menu sumindo) é manual.
 */
describe('permissionGuard', () => {
  let auth: AuthService;
  let router: jasmine.SpyObj<Router>;
  let alert: jasmine.SpyObj<AlertService>;

  beforeEach(() => {
    localStorage.clear();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const alertSpy = jasmine.createSpyObj('AlertService', ['error', 'info', 'success']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: AlertService, useValue: alertSpy },
      ],
    });

    auth = TestBed.inject(AuthService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    alert = TestBed.inject(AlertService) as jasmine.SpyObj<AlertService>;
  });

  afterEach(() => localStorage.clear());

  function runGuard(allowed: any[], routeData: any = {}): boolean | any {
    const guardFn = permissionGuard(allowed);
    const fakeRoute = { data: routeData } as unknown as ActivatedRouteSnapshot;
    const fakeState = {} as RouterStateSnapshot;
    return TestBed.runInInjectionContext(() => guardFn(fakeRoute, fakeState));
  }

  it('sem sessão → redireciona para /auth/log-in e retorna false', () => {
    const result = runGuard(['LEITOR']);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/log-in']);
    expect(alert.error).not.toHaveBeenCalled();
  });

  it('TC-RBAC-01: LEITOR não passa em rotas de gestão', () => {
    auth.setSession({ idUsuario: 1 }); // perfil = LEITOR
    const result = runGuard(['BIBLIOTECARIO'], { titulo: 'Funcionarios' });

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(alert.error).toHaveBeenCalledWith(
      'Acesso negado',
      jasmine.stringMatching(/Funcionarios/)
    );
  });

  it('TC-RBAC-02: BIBLIOTECARIO acessa empréstimos, não acessa financeiro', () => {
    auth.setSession({ idPerfilFuncionarios: '2' }); // BIBLIOTECARIO

    expect(runGuard(['LEITOR', 'BIBLIOTECARIO'])).toBeTrue();

    (router.navigate as jasmine.Spy).calls.reset();
    expect(runGuard(['FINANCEIRO'], { titulo: 'Financeiro' })).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(alert.error).toHaveBeenCalled();
  });

  it('TC-RBAC-03: FINANCEIRO acessa multas/financeiro, não passa em estoque', () => {
    auth.setSession({ idPerfilFuncionarios: '3' }); // FINANCEIRO
    expect(runGuard(['LEITOR', 'FINANCEIRO'])).toBeTrue(); // multas
    expect(runGuard(['FINANCEIRO'])).toBeTrue();           // financeiro
    expect(runGuard(['ESTOQUE'])).toBeFalse();             // estoque negado
  });

  it('TC-RBAC-04: ESTOQUE acessa estoque, não passa em financeiro', () => {
    auth.setSession({ idPerfilFuncionarios: '4' }); // ESTOQUE
    expect(runGuard(['ESTOQUE'])).toBeTrue();
    expect(runGuard(['FINANCEIRO'])).toBeFalse();
  });

  it('TC-RBAC-05: ADMINISTRADOR passa em qualquer rota', () => {
    auth.setSession({ idPerfilFuncionarios: '1' }); // ADMIN
    expect(runGuard(['LEITOR'])).toBeTrue();
    expect(runGuard(['BIBLIOTECARIO'])).toBeTrue();
    expect(runGuard(['FINANCEIRO'])).toBeTrue();
    expect(runGuard(['ESTOQUE'])).toBeTrue();
    expect(runGuard([])).toBeTrue(); // rotas só-ADMIN
  });

  it('TC-RBAC-06: acesso direto via URL bloqueado mostra alerta com título da rota', () => {
    auth.setSession({ idUsuario: 1 }); // LEITOR
    runGuard(['BIBLIOTECARIO'], { titulo: 'Catalogo de Livros' });

    expect(alert.error).toHaveBeenCalledWith(
      'Acesso negado',
      jasmine.stringMatching(/Catalogo de Livros/)
    );
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('rota sem título: alerta usa fallback genérico', () => {
    auth.setSession({ idUsuario: 1 });
    runGuard(['BIBLIOTECARIO']); // sem data.titulo
    expect(alert.error).toHaveBeenCalledWith(
      'Acesso negado',
      jasmine.stringMatching(/esta área/)
    );
  });
});

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
      ],
    });
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('sem sessão: redireciona para login e retorna false', () => {
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/auth/log-in']);
  });

  it('com sessão: retorna true', () => {
    const auth = TestBed.inject(AuthService);
    auth.setSession({ idUsuario: 1 });
    const result = TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );
    expect(result).toBeTrue();
  });
});
