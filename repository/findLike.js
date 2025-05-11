//function
import {dbConnection} from '../function/dbConnection.js'

export async function findLike(sidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM likes WHERE sidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [sidx])
        await callDbConnection.connection.end()

        return {
            result: true,
            like: rows
        }
    }

    catch (err) {
        console.log('[ERROR] findLike')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}