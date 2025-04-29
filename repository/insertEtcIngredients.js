//function
import {dbConnection} from '../function/dbConnection.js'

export async function insertEtcIngredients(uidx, ingredients) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'INSERT INTO etcingredients (uidx, ingredient) VALUES (?,?)'

        for (let i = 0; i < ingredients.length; i++) {
            const [result] = await callDbConnection.connection.execute(query, [uidx, ingredients[i]])

            if (result.affectedRows === 0) {
                throw new Error('query: INSERT INTO etcingredients ' + uidx + ', ' + ingredients[i])
            }
        }

        await callDbConnection.connection.end()

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] InsertEtcIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}