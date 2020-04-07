/** 
 * Copyright 2020, Ingenia, S.A.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * @author jamartin@ingenia.es
 */
require('dotenv').config({
    debug: true,
    //path:'testing' // Busca en la raiz
})

module.exports = {
    httpPort: process.env.HTTP_PORT,
    httpsPort: process.env.HTTPS_PORT,
    databaseHost: process.env.DATABASE_HOST,
    databaseSchema: process.env.DATABASE_SCHEMA,
    databasePort: process.env.DATABASE_PORT,
    databaseUsername: process.env.DATABASE_USERNAME,
    databasePassword: process.env.DATABASE_PASSWORD,
    apiMovil: process.env.API_MOVIL,
    secret: process.env.BACKEND_SECRET,
    tokenMsExpires: process.env.JWT_EXPIRATION_MS
}