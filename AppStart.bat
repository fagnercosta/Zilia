@echo off
echo Iniciando o backend (Django)...

:: Vai para a pasta do backend
cd backend

:: Ativa o ambiente virtual e inicia o servidor Django em uma nova janela minimizada
start /min cmd /c "call venv\Scripts\activate && python manage.py runserver"

:: Volta para a raiz do projeto
cd ..

echo Iniciando o frontend (Next.js)...

:: Vai para a pasta do frontend
cd frontend

:: Verifica se a pasta node_modules existe e instala as dependências se necessário
if not exist "node_modules" (
    echo Instalando dependências do Next.js...
    npm install
)

:: Inicia o servidor Next.js em uma nova janela minimizada
start /min cmd /c "npm run start"

echo Tudo iniciado com sucesso.
exit
