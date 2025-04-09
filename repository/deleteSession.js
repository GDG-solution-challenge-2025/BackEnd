//function
import {dbConnection} from '../function/dbConnection.js'

export async function deleteSession(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'DELETE FROM sessions WHERE uidx = ?'
        const [result] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        return {
            result: true,
        }
    }

    catch (err) {
        console.log('[ERROR] deleteSession')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}