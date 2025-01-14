# Backend

Para rodar o serviço você precisa instalar:
- Python 3.11.X
- [Pipenv](https://pipenv.pypa.io/en/latest/)
- Driver do SqlServer - Microsoft ODBC 17

Instale as dependências do projeto
```
pipenv install
```
Habilitar virtualenv
```
pipenv shell
```
**Obs**: Para rodar os comandos abaixo você precisa ter um SqlServer
rodando com banco `DeveloperDb`, usuário `Developer` e senha `Developer@123`
ou Troque as variáveis no arquivo [./api/settings.py](./api/settings.py).
Rodar as migrations
```
python manage.py migrate
```
Rodar o serviço
```
python manage.py runserver
```
