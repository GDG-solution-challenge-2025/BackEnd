//function
import {dbConnection} from '../function/dbConnection.js'

export async function checkUser(id, pw) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM users WHERE id = ? AND pw = ?'
        const [rows] = await callDbConnection.connection.execute(query, [id, pw])
        await callDbConnection.connection.end()

        if (rows.length === 0) {
            return {
                result: true,
                uidx: null,
                id: null,
                name: null
            }
        }

        return {
            result: true,
            uidx: rows[0].uidx,
            id: rows[0].id,
            name: rows[0].name,
            lang: rows[0].lang
        }
    }

    catch (err) {
        console.log('[ERROR] checkUser')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}