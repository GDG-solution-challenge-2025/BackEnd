//function
import {dbConnection} from '../function/dbConnection.js'

export async function findUser(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM users WHERE uidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [uidx])
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
            name: rows[0].name
        }
    }

    catch (err) {
        console.log('[ERROR] findUser')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}