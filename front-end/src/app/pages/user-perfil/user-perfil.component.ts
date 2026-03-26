import { Component, OnInit } from '@angular/core';
import { UserData } from 'src/app/models/clientes.model';

@Component({
  selector: 'app-user-perfil',
  templateUrl: './user-perfil.component.html',
  styleUrls: ['./user-perfil.component.scss']
})
export class UserPerfilComponent implements OnInit {
    
  activeTab: string = 'dados'; // Controle de abas: dados, seguranca, preferencias, atividade
  
  // Mock do Usuário (Simulando vindo de um serviço de Auth)
  user: UserData = {
    nome: 'Raul Cavalcante',
    email: 'raul.7lmg@biblioteca.com.br',
    telefone: '(11) 98888-7777',
    cpf: '123.456.789-00',
    role: 'BIBLIOTECARIO', // Mude para 'ADMINISTRADOR' ou 'ESTOQUE' para ver as mudanças
    avatar: 'https://ui-avatars.com/api/?name=Raul+Cavalcante&background=10b981&color=fff',
    membroDesde: 'Março de 2023',
    preferencias: {
      notificacoesEmail: true,
      notificacoesWpp: false,
      temaEscuro: false,
      idioma: 'pt-br'
    },
    estatisticas: {
      livrosEmprestados: 12,
      comprasRealizadas: 4,
      multasPendentes: 0
    }
  };

  ngOnInit(): void { }

  changeTab(tabName: string) {
    this.activeTab = tabName;
  }

  saveProfile() {
    console.log('Enviando para o Back-end:', this.user);
    alert('Perfil atualizado com sucesso (Simulação)');
  }

  // Lógica para saber se é funcionário ou cliente comum
  isStaff(): boolean {
    return ['ADMINISTRADOR', 'BIBLIOTECARIO', 'FINANCEIRO', 'ESTOQUE'].includes(this.user.role);
  }

}
