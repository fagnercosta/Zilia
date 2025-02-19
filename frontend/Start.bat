@echo off
echo Iniciando o projeto Next.js...

:: Verifica se a pasta node_modules existe. Se não, instala as dependências.
if not exist "node_modules" (
    echo Instalando dependências...
    npm install
)

:: Inicia o servidor de desenvolvimento Next.js
echo Iniciando o servidor Next.js...
start /min npm run start

:: Fecha o terminal após iniciar o servidor
exit