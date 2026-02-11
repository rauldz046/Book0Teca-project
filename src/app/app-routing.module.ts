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
import { UserPrivacidadeComponent } from './pages/user-privacidade/user-privacidade.component';
import { PreferenciasComponent } from './pages/preferencias/preferencias.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/log-in',
    pathMatch: 'full',
  },
  {
    path: 'auth/log-in',
    component: AuthLoginComponent,
    data: { mostrarLogin: true },
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'usuarios/leitores',
    component: GerenciarLeitoresComponent,
    data: { titulo: 'Leitores de Bookoteca' },
  },
  {
    path: 'usuarios/funcionarios',
    component: GerenciarFuncionariosComponent,
    data: { titulo: 'Funcionarios' },
  },
  {
    path: 'acervo/livros',
    component: CatalogoComponent,
    data: { titulo: 'Catalogo de Livros' },
  },
  {
    path: 'emprestimos/ativos',
    component: EmprestimosUsuariosComponent,
    data: { titulo: 'Emprestimos de Livros' },
  },
  {
    path: 'emprestimos/devolucoes',
    component: DevolucaoUsuariosComponent,
    data: { titulo: 'Devolucao de Livros' },
  },
  {
    path: 'emprestimos/reservas',
    component: ReservasUsuariosComponent,
    data: { titulo: 'Reservas de Livros' },
  },
  {
    path: 'multas/pendentes',
    component: GerenciarMultasUsuariosComponent,
    data: { titulo: 'Multas Abertas' },
  },
  {
    path: 'multas/atividade',
    component: AtividadeUsuariosComponent,
    data: { titulo: 'Minha Atividade' },
  },
  {
    path: 'relatorios/saidas',
    component: SaidaLivrosComponent,
    data: { titulo: 'Saida de Livros' },
  },
  {
    path: 'relatorios/emprestimos-ativos',
    component: EmprestimosAtivosComponent,
    data: { titulo: 'Emprestimos Ativos' },
  },
  {
    path: 'relatorios/financeiro',
    component: GerenciamentoFinanceiroComponent,
    data: { titulo: 'Financeiro' },
  },
  {
    path: 'config/perfil',
    component: UserPerfilComponent,
    data: { titulo: 'Perfil de ', userNome: 'raul.7lmg' },
  },
  {
    path: 'sistema/permissoes',
    component: GerenciarPermissoesComponent,
    data: { titulo: 'Permissoes' },
  },
  {
    path: 'config/privacidade',
    component: UserPrivacidadeComponent,
    data: { titulo: 'Privacidade' },
  },
  {
    path: 'config/preferencias',
    component: PreferenciasComponent,
    data: { titulo: 'Preferencias' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
