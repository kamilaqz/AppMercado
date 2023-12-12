# AppMercado
 Desenvolvido com React Native, este aplicativo se integra a um backend construído em Node.js e Express, garantindo segurança com autenticação JWT (JSON Web Tokens). O aplicativo oferece uma variedade de funcionalidades, incluindo CRUD de usuários, carrinho de compras, histórico de compras, produtos favoritos, personalização de perfil de usuário, e um recurso de chat implementado com Socket.io para comunicação em tempo real dentro do aplicativo.
---

# Recursos Principais
-Autenticação Segura: Utiliza JWT para autenticação segura, garantindo que apenas usuários autorizados acessem funcionalidades sensíveis.

-CRUD de Usuários: Permite a criação, leitura, atualização e exclusão de perfis de usuários.

-Carrinho de Compras: Funcionalidade completa para adicionar produtos ao carrinho, ajustar quantidades e finalizar compras.

-Histórico de Compras: Registra e exibe o histórico de compras anteriores dos usuários.

-Produtos Favoritos: Os usuários podem marcar produtos como favoritos para fácil acesso.

-Personalização de Perfil: Permite aos usuários personalizar seu perfil e adicionar um avatar (foto).

-Chat em Tempo Real: Um sistema de chat integrado utilizando Socket.io, permitindo comunicação em tempo real entre usuários do aplicativo.

# Como Iniciar
## Clonar o Repositório:
git clone https://github.com/kamilaqz/AppMercado.git

## Instalar Dependências:
npm install

As dependências devem ser instaladas no frontend e backend.

## Configurar Variáveis de Ambiente:
Renomeie o arquivo .env.example para .env e ajuste as variáveis de ambiente conforme necessário.

## Iniciar o Aplicativo:
Backend: npm start
Frontend: npx expo start

O aplicativo pode ser testado usando o Expo Go.
