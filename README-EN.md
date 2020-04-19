![cabecera_readme](/docs/img/cabecera_readme.png)

[![logo](/docs/img/logo.png)](https://www.ingenia.es)

> [**Spanish** version](https://github.com/eCaller/eCallerEpidemiaBackEnd/)

## Introduction

eCaller Epidemias is a software solution developed by Ingenia (https://www.ingenia.es), as part of its eCaller Emergencias product range (https://www.ingenia.es/productos/ecaller-emergencias/) and eCaller Ambulancias (https://www.ingenia.es/productos/ecaller-ambulancias/) is licensed as an Open Source solution with licence number GNU GPL v3.0 (https://www.gnu.org/licenses/gpl-3.0.html).

## Who is this solution for?

This solution has been designed for those companies, organizations, entities or public and private institutions in the health sector that require tools in order to be informed of the extent and degree of the spread of COVID-19 outbreaks and implement the necessary actions for their containment in a given region. As a result, the solution provides a work scheme based on the following processes:

* Detection and identification of suspected cases.
* Management, coordination and monitoring of the actions to be carried out for each of the suspected cases.
* Representation, monitoring and quantification of the degree of the spread of outbreaks over a given region.

## Benefits

A coordinated implementation of these three processes will allow the different health organizations to obtain a macro and micro view of the extent of outbreaks, to be informed individually the status of each of the cases detected, and to serve as a basis for guiding efforts to implement containment measures and eradicate transmission hotspots.

## Software solution components

eCaller Epidemias consists of two software components:

* **`Mobile app`**. This is a tool is intended for the public. The objectives pursued by its use is as follows:
    1. In order to download a high volume of calls to the focal points of health organizations.
    2. Provide the public with a simple mechanism of self-assessment to know if they have any symptoms compatible with the development of the virus.
    3. Provide any member of the public with an agile tool to communicate to health organizations the real possibility of contracting the virus.
    4. To enable health organizations to identify members of the public who exhibit symptoms compatible with the development of the virus.

* **`Web application`**. This tool, used by staff of the healthcare organization, has been designed to meet the following objectives:
    1. Provide a working environment to record suspected cases reported by the public from the mobile app.
    2. Have a centralized tool to organize appointments with suspected users, who must undergo the clinical test for detecting the virus.
    3. Facilitate a working environment for the purpose of recording follow-up information on the extent of each case.
    4. Qualitative and quantitative measurement of the degree of the spread of the virus.
    5. Identification of risk zones.

## Installation
1. Clonar el repositorio en una carpeta local

    * `git clone  https://github.com/eCaller/eCallerEpidemiaBackend.git`
  
    * `cd eCallerEpidemiaBackend`
  
2. Instalación librería
    
    * `npm install`

    * `npm install tsc -g`
    
3. Configuración entorno

    * cp .env.example .env
    * Editar el fichero .env con los valores correctos para el entorno de ejecución

## Ejecución en local

Como requerimiento antes de ejecutar la aplicación debe existir el servidor de base de datos, actualmente Postgresql con versión >= 9.6, creando la base de datos desde los scripts. 

1. Ejecución en modo desarrollo

    * `npm run dev`
   
### Creación y ejecución de un contenedor Docker

Como pasos previos se deberán realizar los pasos del apartado [Instalación](README.md#Instalación) y seguidamente realizar los siguientes pasos:

1. Creación de la imagen Docker

    `docker build -t ecaller-epidemias/ecaller-epidemias-backend .`

2. Ejecución de la imagen Docker

    `docker run -d -p 8443:8443 --rm --name ecaller-epidemas-backend-1 ecaller-epidemias/ecaller-epidemias-backend`

## Repositories

* **`Mobile app`**.
    - [eCallerEpidemiaMovil](https://github.com/eCaller/eCallerEpidemiaMovil/)

* **`Web application`**.
    - [eCallerEpidemiaWeb](https://github.com/eCaller/eCallerEpidemiaWeb/)
    - [eCallerEpidemiaBackEnd](https://github.com/eCaller/eCallerEpidemiaBackEnd/)

## Functional description

The functional documentation of the software solution is available at the following link [Wiki-Functional description](https://github.com/eCaller/eCallerEpidemiaWeb/wiki/functional-description).

## Technical description

The technical documentation of the software solution is available at the following link [Wiki-Technical description](https://github.com/eCaller/eCallerEpidemiaWeb/wiki/technical-description).

## Licensing

GNU GPL v3.0 (https://www.gnu.org/licenses/gpl-3.0.html).
