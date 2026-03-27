Tudo está no ZIP. Aqui está o mapa completo do que foi gerado e onde colar cada coisa:
📁 Front-end — arquivos novos (src/app/core/)
ArquivoO que fazcore/services/auth.service.tsGerencia sessão, login, logout, perfil e permissõescore/guards/auth.guard.tsBloqueia rotas sem login → redireciona para /auth/log-incore/guards/role.guard.tsBloqueia rotas por perfil usando data.rolescore/interceptors/auth.interceptor.tsInjeta token em todas as requisições HTTPpages/acesso-negado/acesso-negado.component.tsTela de acesso negado
📝 Front-end — arquivos substituídos
ArquivoO que mudouapp-routing.module.tsTodas as rotas agora têm authGuard + roleGuard com roles definidosapp.module.tsRegistra AuthInterceptor, MessageService, ConfirmationService e o AcessoNegadoComponentapp.component.tsLê rota corretamente percorrendo a árvore de rotasauth-login.component.tsUsa AuthService para salvar sessão após loginnav.component.tsLê auth.perfil e auth.nomeUsuario da sessão real; botão Sair chama auth.logout()
🔧 Back-end — arquivos substituídos
ArquivoO que mudoucontrollers/Usuarios.controller.jsAdicionou bcrypt, corrigiu resres → res, login agora compara hashcontrollers/Funcionarios.controller.jsAdicionou bcrypt, login retorna o perfil (Descricao) juntopackage.jsonAdicionou bcrypt e jsonwebtoken nas dependências
Depois de colar os arquivos, rode no back-end:
bashnpm install
