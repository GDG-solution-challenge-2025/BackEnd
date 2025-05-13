//function
import {dbConnection} from '../function/dbConnection.js'

export async function deleteUidx(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        var query = 'DELETE FROM likes WHERE uidx = ?'
        var [result] = await callDbConnection.connection.execute(query, [uidx])
        var query = 'DELETE FROM search WHERE uidx = ?'
        var [result] = await callDbConnection.connection.execute(query, [uidx])
        var query = 'DELETE FROM etcingredients WHERE uidx = ?'
        var [result] = await callDbConnection.connection.execute(query, [uidx])
        var query = 'DELETE FROM sessions WHERE uidx = ?'
        var [result] = await callDbConnection.connection.execute(query, [uidx])
        var query = 'DELETE FROM users WHERE uidx = ?'
        var [result] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        return {
            result: true,
        }
    }

    catch (err) {
        console.log('[ERROR] deleteUidx')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}