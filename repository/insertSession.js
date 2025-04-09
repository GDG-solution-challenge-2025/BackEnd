//function
import {dbConnection} from '../function/dbConnection.js'

export async function insertSession(uidx, session, expire) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'INSERT INTO sessions (uidx, session, expire) VALUES (?, ?, ?)'
        const [result] = await callDbConnection.connection.execute(query, [uidx, session, expire])
        await callDbConnection.connection.end()

        if (result.affectedRows === 0) {
            throw new Error('query: INSERT INTO sessions ' + uidx + ', ' + session + ', ' + expire)
        }

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] insertSession')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}