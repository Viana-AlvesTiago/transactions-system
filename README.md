Financial Transactions API
API desenvolvida em Node.js com NestJS, TypeORM, e PostgreSQL para gerenciar transações financeiras, incluindo depósitos, saques e transferências entre usuários.

📋 Funcionalidades
Cadastro de Usuários com e-mail e senha criptografada.
Autenticação JWT para acesso seguro às rotas.
Depósito e saque no saldo do usuário.
Transferência de valores entre usuários com validação de saldo.
Consulta de transações associadas a um usuário.
Validações robustas para garantir integridade dos dados.
🛠️ Tecnologias Utilizadas
Node.js (Runtime)
NestJS (Framework)
TypeORM (ORM para banco de dados)
PostgreSQL (Banco de Dados)
Redis (Para filas com Bull)
Docker (Para Redis e PostgreSQL)
Swagger (Documentação automática da API)
Bcrypt (Criptografia de senhas)
JWT (Autenticação)
📦 Pré-requisitos
Antes de iniciar o projeto, certifique-se de ter instalado:

Node.js (v14 ou superior): Download Node.js
Docker e Docker Compose: Download Docker
Git: Download Git
💻 Passo a Passo para Rodar o Projeto
1. Clone o Repositório
bash
Copiar código
git clone https://github.com/Viana-AlvesTiago/transactions-system.git
cd seu-repositorio
2. Instale as Dependências
bash
Copiar código
npm install
3. Configure as Variáveis de Ambiente
Crie um arquivo .env na raiz do projeto com as seguintes variáveis:

plaintext
Copiar código
# Configurações do Banco de Dados
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=financial_system

# Configuração do JWT
JWT_SECRET=your_jwt_secret_key

# Configuração do Redis (para filas Bull)
REDIS_HOST=localhost
REDIS_PORT=6379

# Porta do servidor
PORT=3000
4. Suba os Containers do Docker (PostgreSQL e Redis)
O projeto utiliza Docker para facilitar a configuração do banco de dados e do Redis. Execute o comando abaixo:

bash
Copiar código
docker-compose up -d
Nota: Certifique-se de que as portas 5432 (PostgreSQL) e 6379 (Redis) estejam livres.

5. Execute as Migrations
Execute as migrations para criar as tabelas no banco de dados:

bash
Copiar código
npm run typeorm:migration:run
6. Inicie o Servidor
Agora, inicie o servidor em modo desenvolvimento:

bash
Copiar código
npm run start:dev
7. Acesse a Documentação da API
Acesse a documentação automática gerada pelo Swagger:

plaintext
Copiar código
http://localhost:3000/api/docs
🧪 Testes
Para rodar os testes unitários:

bash
Copiar código
npm run test
📂 Estrutura do Projeto
plaintext
Copiar código
src/
│-- modules/
│   │-- user/                # Módulo de Usuários
│   │-- auth/                # Módulo de Autenticação
│   │-- transactions/        # Módulo de Transações
│   │-- queue/               # Módulo para Bull e Redis
│-- main.ts                  # Arquivo principal da aplicação
│-- app.module.ts            # Módulo principal
│-- .env                     # Variáveis de ambiente
│-- docker-compose.yml       # Configuração do Docker
🔧 Comandos Úteis
Subir o servidor:
bash
Copiar código
npm run start:dev
Parar os containers do Docker:
bash
Copiar código
docker-compose down
Rodar as migrations:
bash
Copiar código
npm run typeorm:migration:run
🔑 Endpoints Importantes
Cadastro de Usuários:

POST /users/signup
Login:

POST /auth/signin
Depósito e Saque:

POST /transactions
Transferência:

POST /transactions/transfer
Listar Transações:

GET /transactions/:userId
📞 Contato
Se tiver dúvidas ou encontrar algum problema, entre em contato:

Nome: Tiago Viana Alves
Email: tiagovianaalves46@gmail.com
GitHub: https://github.com/Viana-AlvesTiago/
