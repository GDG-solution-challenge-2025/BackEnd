//function
import {dbConnection} from '../function/dbConnection.js'

export async function updateName(uidx, name) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'UPDATE users SET name = ? WHERE uidx = ?'
        const [result] = await callDbConnection.connection.execute(query, [name, uidx])
        await callDbConnection.connection.end()

        if (result.affectedRows === 0) {
            throw new Error('query: UPDATE users SET ' + name + ' WHERE ' + uidx)
        }

        return {
            result: true,
        }
    }

    catch (err) {
        console.log('[ERROR] updateName')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}