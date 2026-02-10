import { ChartModule } from 'primeng/chart';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponenteTitleComponent } from './componentes/componente-title/componente-title.component';
import { DisplayComponent } from './componentes/display/display.component';
import { HeaderComponent } from './componentes/header/header.component';
import { NavComponent } from './componentes/nav/nav.component';
import { HomeComponent } from './pages/home/home.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AvatarModule } from 'primeng/avatar';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextModule } from 'primeng/inputtext';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
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
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AppComponent,
    ComponenteTitleComponent,
    DisplayComponent,
    HeaderComponent,
    NavComponent,
    HomeComponent,
    UsuariosComponent,
    GerenciarLeitoresComponent,
    GerenciarFuncionariosComponent,
    CatalogoComponent,
    EmprestimosUsuariosComponent,
    DevolucaoUsuariosComponent,
    ReservasUsuariosComponent,
    GerenciarMultasUsuariosComponent,
    AtividadeUsuariosComponent,
    SaidaLivrosComponent,
    EmprestimosAtivosComponent,
    GerenciamentoFinanceiroComponent,
    UserPerfilComponent,
    GerenciarPermissoesComponent,
    UserPrivacidadeComponent,
    PreferenciasComponent,
    AuthLoginComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    TableModule,
    ButtonModule,
    FormsModule,
    ChartModule,
    CardModule,
    ScrollPanelModule,
    PanelMenuModule,
    AvatarModule,
    DropdownModule,
    InputSwitchModule,
    BrowserAnimationsModule,
    InputTextModule,
    CarouselModule,
    TagModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
