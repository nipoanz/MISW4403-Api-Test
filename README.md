## Airport - Nestapp

Esta aplicación implementa un sistema para consultar la cobertura de aerolíneas y sus aeropuertos asociados, desarrollado como parte del parcial práctico de la materia Diseño y construcción de APIs (MISW4403).


1. Cree la entidad Aerolinea en el módulo correspondiente. Una aerolínea tiene 
un nombre, una descripción, una fecha de fundación y una página web. 
2. Cree la entidad Aeropuerto en el módulo correspondiente. Un aeropuerto 
tiene un nombre, un código, un país y una ciudad. 
3. Incluya la asociación entre Aerolinea y Aeropuerto; tenga en cuenta que un 
aeropuerto cuenta con múltiples aerolíneas y una aerolínea tiene cobertura 
en distintos aeropuertos

## Configuración

Antes de ejecutar la aplicación, es necesario definir un archivo .env en la raíz del proyecto con la variable de entorno que especifica la conexión a la base de datos PostgreSQL.

> Por favor configure el archivo .env con la variable DATABASE_URL, que contiene la cadena de conexión a la base de datos PostgreSQL.

Ejemplo de archivo .env:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/airports?schema=public"
```

## Ejecutar Proyecto con Prisma

Para ejecutar el proyecto, es necesario crear la base de datos y las tablas correspondientes. Para ello, se utiliza Prisma como ORM.

1. Instalar las dependencias de proyecto

```bash
yarn install
```

2. Defina el archivo .env con la cadena de conexión a la base de datos PostgreSQL.

3. Crear la base de datos y las tablas correspondientes

```bash
yarn prisma:deploy
```

4. Ejecutar el proyecto

```bash
yarn start
```


### Diagrama de la base de datos

Adicionalmente se define el modelo físico  (Entidad/Relación) para visualizar implementación del modelo de datos.

```mermaid
classDiagram
    Airline "1" -- "0..*" AirlineAirport : has
    Airport "1" -- "0..*" AirlineAirport : connects with
    AirlineAirport "0..*" -- "1" Airline : belongs to
    AirlineAirport "0..*" -- "1" Airport : linked to

    class Airline {
        -id: UUID
        -name: String
        -description: String
        -foundingDate: DateTime
        -website: String
        -createdAt: DateTime
        -updatedAt: DateTime
    }

    class Airport {
        -id: UUID
        -name: String
        -code: String
        -country: String
        -city: String
    }

    class AirlineAirport {
        -airlineId: UUID
        -airportId: UUID
    }
```


## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Pruebas Unitarias

🧪 Pruebas realizadas
Cobertura para los servicios de:

- AirlineController
- AirlineService
- AirportController
- AirportService
- AirlineAirportController
- AirlineAirportService

Se verifican casos exitosos y fallas como recursos no encontrados o datos inválidos.

## Postman

Para probar la API, se incluye una colección de Postman que contiene el desarrollo de las pruebas

>  La colección se encuentra exportada en collections/Airport.postman_collection.json.

La colección incluye las siguientes pruebas:

| Acción | Aerolíneas                               | Aeropuertos                              | Aerolínea-Aeropuerto                                      |
| ------ | ---------------------------------------- | ---------------------------------------- | --------------------------------------------------------- |
| POST   | ✅ Crear válida<br>❌ Crear inválida       | ✅ Crear válida<br>❌ Crear inválida       | ✅ Asociar válida<br>❌ Asociar inexistente                 |
| GET    | ✅ Todas<br>✅ Por ID<br>❌ Por ID inválido | ✅ Todas<br>✅ Por ID<br>❌ Por ID inválido | ✅ Todos<br>✅ Uno<br>❌ Uno no asociado                     |
| PUT    | ✅ Actualizar<br>❌ ID no existe           | ✅ Actualizar<br>❌ ID no existe           | ✅ Actualizar asociaciones<br>❌ Con aeropuerto inexistente |
| DELETE | ✅ Eliminar<br>❌ ID no existe             | ✅ Eliminar<br>❌ ID no existe             | ✅ Eliminar asociación<br>❌ Asociación no existente        |



## Estructura del proyecto

```bash
src/
├── airline/
├── airport/
├── airline-airport/
├── prisma/
├── main.ts
collections/
└── Airport.postman_collection.json
.env
```
