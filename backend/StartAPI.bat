@echo off
echo Iniciando o backend.

:: Ativa o ambiente virtual do Django
echo Ativando o ambiente virtual...
call venv\Scripts\activate

:: Instala as dependências do Django (caso não tenha sido feito anteriormente)
::echo Instalando as dependências...
::pip install -r requirements.txt

:: Inicia o servidor do Django
echo Iniciando o servidor Django...
start /B python manage.py runserver

:: Fecha o terminal após iniciar o servidor
exit