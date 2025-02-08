FROM python:3.11.2-slim-buster

ENV PYTHONUNBUFFERED 1
RUN apt-get -y update; apt-get -y install curl gnupg2
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -

#Debian 10
RUN curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list

RUN apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17 mssql-tools
ENV PATH="$PATH:/opt/mssql-tools/bin"
# optional: for unixODBC development headers
RUN apt-get install -y unixodbc-dev libgssapi-krb5-2
EXPOSE 80
ENV APP_PATH /usr/src/api
RUN mkdir ${APP_PATH}

WORKDIR $APP_PATH

ARG INSTALLATION_DEPENDENCY_LIBS="build-essential python3-setuptools libcups2-dev python3-dev libffi-dev ncurses-dev libpng-dev libjpeg-dev libproj-dev libpq-dev"
ARG RUNTIME_LIBS="netcat python3-wheel python3-cffi libcairo2 libpango-1.0-0 libpangocairo-1.0-0 shared-mime-info gettext binutils gdal-bin"

COPY . $APP_PATH/

RUN apt-get install -y $INSTALLATION_DEPENDENCY_LIBS && \
    apt-get install -y $RUNTIME_LIBS && \
    apt-get clean && \
	pip install --upgrade pip && \
	pip install pipenv && \
	pipenv run pip install pip && \
	pipenv install --deploy --system && \
	rm -rf /root/.cache && \
	chmod +x ${APP_PATH}/start.sh

CMD $APP_PATH/start.sh
