import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

/**
 * Specs do AuthService — cobre TC-AUTH-01, TC-AUTH-02, TC-AUTH-04, TC-AUTH-05, TC-AUTH-07.
 * Casos de UI/HTTP (AUTH-03, AUTH-06) são cobertos por roteiro manual + e2e.
 */
describe('AuthService', () => {
  let service: AuthService;
  const KEY = 'infoSessao';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => localStorage.clear());

  it('deve iniciar sem sessão quando localStorage vazio', () => {
    expect(service.isLogged).toBeFalse();
    expect(service.session).toBeNull();
    expect(service.profile).toBeNull();
  });

  it('TC-AUTH-01: login como LEITOR define perfil LEITOR', () => {
    service.setSession({ idUsuario: 7, Nome: 'Joana', Email: 'joana@x.com' });

    expect(service.isLogged).toBeTrue();
    expect(service.profile).toBe('LEITOR');
    expect(JSON.parse(localStorage.getItem(KEY)!).idUsuario).toBe(7);
  });

  it('TC-AUTH-02: login como ADMIN (idPerfilFuncionarios=1) define perfil ADMINISTRADOR', () => {
    service.setSession({
      idFuncionario: 1,
      NomeFunc: 'Admin',
      idPerfilFuncionarios: '1',
    });
    expect(service.profile).toBe('ADMINISTRADOR');
  });

  it('mapeia todos os ids de perfil para o nome correto', () => {
    const casos: Array<[string, string]> = [
      ['1', 'ADMINISTRADOR'],
      ['2', 'BIBLIOTECARIO'],
      ['3', 'FINANCEIRO'],
      ['4', 'ESTOQUE'],
      ['5', 'LEITOR'],
    ];
    for (const [id, esperado] of casos) {
      service.setSession({ idPerfilFuncionarios: id });
      expect(service.profile).toBe(esperado as any);
    }
  });

  it('TC-AUTH-05: logout limpa sessão e localStorage', () => {
    service.setSession({ idUsuario: 1 });
    expect(service.isLogged).toBeTrue();

    service.logout();

    expect(service.isLogged).toBeFalse();
    expect(localStorage.getItem(KEY)).toBeNull();
    expect(service.profile).toBeNull();
  });

  it('TC-AUTH-07: sessão preserva endereco e banco enriquecidos', () => {
    const enderecoMock = { idInfoEnd: 10, Cidade: 'São Paulo', UF: 'SP' };
    const bancoMock = { idInfoBanco: 20, NomeBanco: 'BB', CodigosPix: 'pix@x.com' };

    service.setSession({
      idUsuario: 99,
      Nome: 'Teste',
      endereco: enderecoMock,
      banco: bancoMock,
    });

    expect(service.session.endereco).toEqual(enderecoMock);
    expect(service.session.banco).toEqual(bancoMock);

    // Deve sobreviver a "recarregar a página" — instância nova, mesmo localStorage
    const novoService = new AuthService();
    expect(novoService.session.endereco).toEqual(enderecoMock);
    expect(novoService.session.banco).toEqual(bancoMock);
  });

  it('TC-AUTH-04: sessão preserva flag SenhaInicial para forçar troca', () => {
    service.setSession({ idUsuario: 5, SenhaInicial: true });
    expect(service.session.SenhaInicial).toBeTrue();

    service.setSession({ idFuncionario: 6, SenhaInicialFunc: true });
    expect(service.session.SenhaInicialFunc).toBeTrue();
  });

  it('hasProfile: ADMIN sempre passa', () => {
    service.setSession({ idPerfilFuncionarios: '1' });
    expect(service.hasProfile(['LEITOR'])).toBeTrue();
    expect(service.hasProfile(['FINANCEIRO'])).toBeTrue();
  });

  it('hasProfile: LEITOR só passa se LEITOR estiver na lista', () => {
    service.setSession({ idUsuario: 1 });
    expect(service.hasProfile(['LEITOR'])).toBeTrue();
    expect(service.hasProfile(['FINANCEIRO', 'ESTOQUE'])).toBeFalse();
  });

  it('hasProfile retorna false sem sessão', () => {
    expect(service.hasProfile(['ADMINISTRADOR'])).toBeFalse();
  });

  it('readStorage lida com JSON corrompido sem quebrar', () => {
    localStorage.setItem(KEY, '{json-corrompido');
    const novoService = new AuthService();
    expect(novoService.session).toBeNull();
    expect(novoService.isLogged).toBeFalse();
  });

  it('session$ emite mudanças (RxJS observable)', (done) => {
    const valores: any[] = [];
    service.session$.subscribe((s) => {
      valores.push(s);
      if (valores.length === 3) {
        expect(valores[0]).toBeNull();
        expect(valores[1].idUsuario).toBe(1);
        expect(valores[2]).toBeNull();
        done();
      }
    });
    service.setSession({ idUsuario: 1 });
    service.logout();
  });
});
