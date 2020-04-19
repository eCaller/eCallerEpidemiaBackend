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

1. Clone the repository to a local folder:
    * `git clone  https://github.com/eCaller/eCallerEpidemiaBackend.git`
    * `cd eCallerEpidemiaBackend`

2. Library installation:
    * `npm install`
    * `npm install tsc -g`

3. Setting the environment:
    * cp .env.example .env
    * Edit the .env file with the correct values for the runtime environment.

## Local execution

As a requirement before executing the application, the database server must exist, currently Postgresql with version> = 9.6, creating the database from the scripts.

1. Running in development mode:

    * `npm run dev`
   
## Create and run a Docker container

As previous steps, the steps in the [Installation](README-EN.md#Installation) section must be performed and then the following steps must be performed:

1. Docker image creation:

    `docker build -t ecaller-epidemias/ecaller-epidemias-backend .`

2. Docker image execution:

    `docker run -d -p 8443:8443 --rm --name ecaller-epidemas-backend-1 ecaller-epidemias/ecaller-epidemias-backend`

## Repositories

* **`Mobile app`**.
    - [eCallerEpidemiaMovil](https://github.com/eCaller/eCallerEpidemiaMovil/blob/master/README-EN.md)

* **`Web application`**.
    - [eCallerEpidemiaWeb](https://github.com/eCaller/eCallerEpidemiaWeb/blob/master/README-EN.md)
    - [eCallerEpidemiaBackEnd](https://github.com/eCaller/eCallerEpidemiaBackEnd/blob/master/README-EN.md)

## Functional description

The functional documentation of the software solution is available at the following link [Wiki-FunctionalDescription](https://github.com/eCaller/eCallerEpidemiaBackEnd/wiki/functional-description).

## Technical description

The technical documentation of the software solution is available at the following link [Wiki-TechnicalDescription](https://github.com/eCaller/eCallerEpidemiaBackEnd/wiki/technical-description).

## Licensing

GNU GPL v3.0 (https://www.gnu.org/licenses/gpl-3.0.html).
