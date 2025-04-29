//function
import {dbConnection} from '../function/dbConnection.js'

export async function findEtcIngredients(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM etcingredients WHERE uidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        return {
            result: true,
            ingredients: rows.map(row => row.ingredient)
        }
    }

    catch (err) {
        console.log('[ERROR] findEtcIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}