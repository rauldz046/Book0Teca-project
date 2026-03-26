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
import { PasswordModule } from 'primeng/password';
import { StepsModule } from 'primeng/steps';
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
import { PreferenciasComponent } from './pages/preferencias/preferencias.component';
import { AuthLoginComponent } from './pages/auth-login/auth-login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalEditClienteComponent } from './pages/gerenciar-leitores/modal-edit-cliente/modal-edit-cliente.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SignInFormUserComponent } from './pages/auth-login/sign-in-form-user/sign-in-form-user.component';
import { InputMaskModule } from 'primeng/inputmask'
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';






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
    PreferenciasComponent,
    AuthLoginComponent,
    ModalEditClienteComponent,
    SignInFormUserComponent,
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
    MatDialogModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSnackBarModule,
    PasswordModule,
    StepsModule,
    InputMaskModule,
    ConfirmDialogModule,
    ToastModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    DialogModule,
    CheckboxModule,
    ProgressSpinnerModule,    
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
