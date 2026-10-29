# Como instalar

Requisitos:

- WSL
- Docker
- npm

## Instalando o WSL

Aperte `win + R`, digite `powershell` e aperte Enter. No terminal, digite:

```pwsh
wsl --install
```

## Instalando o Docker

Abra a Microsoft Store e faça o download do Docker Desktop.
Ao abrir o aplicativo, a _engine_ vai iniciar.

## Instalando o npm

Faça o download do [Node.js](https://nodejs.org/en/download/)

## Pegando as variáveis de ambiente

Como as variáveis de ambiente possuem a senha do banco e outras coisas importantes, não é seguro deixar no github. Por isso, é melhor pegar o arquivo diretamente comigo.

## Agora é só rodar o código

Abra um terminal na localização onde você quer deixar os arquivos deste repositório, clone o repositório e instale as dependências:

```pwsh
git clone git@github.com:agonilha/projeto_jornada.git
cd projeto_jornada
npm install
npx prisma validate
npx prisma generate
npx tsx --env-file=.env .\scripts\create-test-user.ts
npm run dev
```

Agora o código estará rodando, com um usuário de perfil administrador existente.
