//node module
import mysql from 'mysql2/promise'

//config
import config from '../config.js'

export async function dbConnection() {
    try {
        const connection = await mysql.createConnection({
           host: config.dbIp,
           port: config.dbPort,
           user: config.dbId,
           password: config.dbPw,
           database: config.dbSchema
        })

        connection.connect((err) => {
            throw err
        })

        return {
            result: true,
            connection: connection
        }
    }

    catch (err) {
        console.log('[ERROR] dbConnection')
        console.log(err + '\n\n')
    }

    return {
        result: false
    }
}