//function
import {dbConnection} from '../function/dbConnection.js'

export async function checkSession(session) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM sessions WHERE session = ?'
        const [rows] = await callDbConnection.connection.execute(query, [session])
        await callDbConnection.connection.end()

        if (rows.length === 0) {
            return {
                result: true,
                uidx: null,
                expire: null
            }
        }

        return {
            result: true,
            uidx: rows[0].uidx,
            expire: rows[0].expire
        }
    }

    catch (err) {
        console.log('[ERROR] checkSession')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}