//function
import {dbConnection} from '../function/dbConnection.js'

export async function deleteLike(sidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'DELETE FROM likes WHERE sidx = ?'
        const [result] = await callDbConnection.connection.execute(query, [sidx])
        await callDbConnection.connection.end()

        return {
            result: true,
        }
    }

    catch (err) {
        console.log('[ERROR] deleteLike')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}