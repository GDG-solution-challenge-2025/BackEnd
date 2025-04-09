//function
import {dbConnection} from '../function/dbConnection.js'

export async function duplicatedId(id) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM users WHERE id = ?'
        const [rows] = await callDbConnection.connection.execute(query, [id])
        await callDbConnection.connection.end()

        if (rows.length !== 0) {
            return {
                result: true,
                dubplicate: true
            }
        }

        return {
            result: true,
            dubplicate: false
        }
    }

    catch (err) {
        console.log('[ERROR] duplicatedId')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}