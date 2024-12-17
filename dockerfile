# 1. Usa a imagem oficial do Node.js como base
FROM node:18

# 2. Define o diretório de trabalho dentro do container
WORKDIR /app

# 3. Copia o arquivo package.json e package-lock.json para o container
COPY package*.json ./

# 4. Instala as dependências
RUN npm install

# 5. Copia todo o código do projeto para o container
COPY . .

# 6. Expor a porta onde o servidor será executado
EXPOSE 3000

# 7. Comando para iniciar o servidor
CMD ["npm", "run", "start:dev"]
