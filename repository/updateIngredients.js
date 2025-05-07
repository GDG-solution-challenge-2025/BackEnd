//function
import {dbConnection} from '../function/dbConnection.js'

export async function updateIngredients(uidx, can, cant) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        for (let i = 0; i < can.length; i++) {
            const column = can[i]
            const query = `UPDATE users SET ${column} = 0 WHERE uidx = ?`
            const [result] = await callDbConnection.connection.execute(query, [uidx])

            if (result.affectedRows === 0) {
                throw new Error('query: UPDATE users SET ' + can[i] + ' = 0 WHERE uidx = ' + uidx)
            }
        }

        for (let i = 0; i < cant.length; i++) {
            const column = cant[i]
            const query = `UPDATE users SET ${column} = 1 WHERE uidx = ?`
            const [result] = await callDbConnection.connection.execute(query, [uidx])

            if (result.affectedRows === 0) {
                throw new Error('query: UPDATE users SET ' + can[i] + ' = 1 WHERE uidx = ' + uidx)
            }
        }

        await callDbConnection.connection.end()

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] updateIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}