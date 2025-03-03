# Challenge

Proyecto generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.14 como prueba técnica para [RIU Hotel & Resorts](https://www.riu.com/es) a través de [MinDATA](https://www.mindata.es/)

## Tablero del proyecto

Tablero [RIU Front End Challenge en Trello](https://trello.com/b/Hw2yVhsj/riu-front-end-challenge)

## Estructura del proyecto

Basado en arquitectura limpia

```
/src
│─ app
│  │─ core 
│  │─ shared
│  │─ features
│  │  │─ {feature}
│  │  │  │─ pages
│  │  │  │─ services
│  │─ layout
│─ environments
```

## Build

Ejecta `ng build` para buildear el proyecto. El build será creado en la carpeta `dist/challenge`. Se debe utilizar algún http-server para poder levantarlo.

## Unit testing

Ejecuta `ng test` para ejecutar tests vía [Karma](https://karma-runner.github.io).
Puede ver su coverage en el navegador abriendo el archivo `index.html` dentro de la carpeta `coverage`.

## Docker

Se debe instalar [Docker](https://docs.docker.com/get-started/get-docker/) y [docker-compose](https://docs.docker.com/compose/install), y seguir las guías.
Una vez hecho eso ejecuta `docker compose up --build -d`. El proyecto correrá en `http://localhost:8080`.
