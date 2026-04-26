import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GerenciarLeitoresComponent } from './pages/gerenciar-leitores/gerenciar-leitores.component';
import { GerenciarFuncionariosComponent } from './pages/gerenciar-funcionarios/gerenciar-funcionarios.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { EmprestimosUsuariosComponent } from './pages/emprestimos-usuarios/emprestimos-usuarios.component';
import { DevolucaoUsuariosComponent } from './pages/devolucao-usuarios/devolucao-usuarios.component';
import { ReservasUsuariosComponent } from './pages/reservas-usuarios/reservas-usuarios.component';
import { GerenciarMultasUsuariosComponent } from './pages/gerenciar-multas-usuarios/gerenciar-multas-usuarios.component';
import { AtividadeUsuariosComponent } from './pages/atividade-usuarios/atividade-usuarios.component';
import { SaidaLivrosComponent } from './pages/saida-livros/saida-livros.component';
import { EmprestimosAtivosComponent } from './pages/emprestimos-ativos/emprestimos-ativos.component';
import { GerenciamentoFinanceiroComponent } from './pages/gerenciamento-financeiro/gerenciamento-financeiro.component';
import { UserPerfilComponent } from './pages/user-perfil/user-perfil.component';
import { GerenciarPermissoesComponent } from './pages/gerenciar-permissoes/gerenciar-permissoes.component';
import { PreferenciasComponent } from './pages/preferencias/preferencias.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { SignInFormUserComponent } from './pages/auth-login/sign-in-form-user/sign-in-form-user.component';
import { DetalheLivroComponent } from './pages/detalhe-livro/detalhe-livro.component';
import { authGuard, permissionGuard } from './services/permission.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/log-in',
    pathMatch: 'full',
  },
  {
    path: 'auth/log-in',
    component: AuthLoginComponent,
    data: { userlogado: false, isLogin: true },
  },
  {
    path: 'auth/sign-in',
    component: SignInFormUserComponent,
    data: { userlogado: false, isSignin: true },
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'usuarios/leitores',
    component: GerenciarLeitoresComponent,
    canActivate: [permissionGuard(['BIBLIOTECARIO'])],
    data: { titulo: 'Leitores de Bookoteca' },
  },
  {
    path: 'usuarios/funcionarios',
    component: GerenciarFuncionariosComponent,
    canActivate: [permissionGuard([])], // só ADMIN
    data: { titulo: 'Funcionarios' },
  },
  {
    path: 'acervo/livros',
    component: CatalogoComponent,
    canActivate: [authGuard],
    data: { titulo: 'Catalogo de Livros' },
  },
  {
    path: 'acervo/livro/:id',
    component: DetalheLivroComponent,
    canActivate: [authGuard],
    data: { titulo: 'Detalhe do Livro' },
  },
  {
    path: 'emprestimos/ativos',
    component: EmprestimosUsuariosComponent,
    canActivate: [permissionGuard(['LEITOR', 'BIBLIOTECARIO'])],
    data: { titulo: 'Emprestimos de Livros' },
  },
  {
    path: 'emprestimos/devolucoes',
    component: DevolucaoUsuariosComponent,
    canActivate: [permissionGuard(['BIBLIOTECARIO'])],
    data: { titulo: 'Devolucao de Livros' },
  },
  {
    path: 'emprestimos/reservas',
    component: ReservasUsuariosComponent,
    canActivate: [permissionGuard(['LEITOR', 'BIBLIOTECARIO'])],
    data: { titulo: 'Reservas de Livros' },
  },
  {
    path: 'multas/pendentes',
    component: GerenciarMultasUsuariosComponent,
    canActivate: [permissionGuard(['LEITOR', 'FINANCEIRO'])],
    data: { titulo: 'Multas Abertas' },
  },
  {
    path: 'multas/atividade',
    component: AtividadeUsuariosComponent,
    canActivate: [permissionGuard(['LEITOR'])],
    data: { titulo: 'Minha Atividade' },
  },
  {
    path: 'relatorios/saidas',
    component: SaidaLivrosComponent,
    canActivate: [permissionGuard(['ESTOQUE'])],
    data: { titulo: 'Saida de Livros' },
  },
  {
    path: 'relatorios/emprestimos-ativos',
    component: EmprestimosAtivosComponent,
    canActivate: [permissionGuard(['BIBLIOTECARIO'])],
    data: { titulo: 'Emprestimos Ativos' },
  },
  {
    path: 'relatorios/financeiro',
    component: GerenciamentoFinanceiroComponent,
    canActivate: [permissionGuard(['FINANCEIRO'])],
    data: { titulo: 'Financeiro' },
  },
  {
    path: 'config/perfil',
    component: UserPerfilComponent,
    canActivate: [authGuard],
    data: { titulo: 'Perfil de ' },
  },
  {
    path: 'sistema/permissoes',
    component: GerenciarPermissoesComponent,
    canActivate: [permissionGuard([])], // só ADMIN
    data: { titulo: 'Permissoes' },
  },
  {
    path: 'config/preferencias',
    component: PreferenciasComponent,
    canActivate: [authGuard],
    data: { titulo: 'Preferencias' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
