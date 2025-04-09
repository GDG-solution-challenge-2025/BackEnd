//function
import {dbConnection} from '../function/dbConnection.js'

export async function findSession(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM sessions WHERE uidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        if (rows.length === 0) {
            return {
                result: true,
                session: null
            }
        }

        return {
            result: true,
            session: rows[0].session
        }
    }

    catch (err) {
        console.log('[ERROR] findSession')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}