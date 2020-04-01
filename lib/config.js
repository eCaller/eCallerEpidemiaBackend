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
    databasePassword: process.env.DATABASE_PASSWORD
}