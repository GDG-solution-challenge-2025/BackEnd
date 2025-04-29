//function
import {dbConnection} from '../function/dbConnection.js'

export async function deleteEtcIngredients(uidx, ingredients) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'DELETE FROM etcingredients WHERE uidx = ? AND ingredient = ?'

        for (let i = 0; i < ingredients.length; i++) {
            const [result] = await callDbConnection.connection.execute(query, [uidx, ingredients[i]])

            if (result.affectedRows === 0) {
                throw new Error('query: DELETE FROM etcingredients WHERE ' + uidx + 'AND' + ingredients[i])
            }
        }

        await callDbConnection.connection.end()

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] DeleteEtcIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}