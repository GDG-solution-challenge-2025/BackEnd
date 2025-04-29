//function
import {dbConnection} from '../function/dbConnection.js'

export async function checkEtcIngredients(uidx, ingredients) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM etcingredients WHERE uidx = ? AND ingredient = ?'

        for (let i = 0; i < ingredients.length; i++) {
            const [rows] = await callDbConnection.connection.execute(query, [uidx, ingredients[i]])
            if (rows.length > 0) {
                return {
                    result: true,
                    ingredient: ingredients[i]
                }
            }
        }

        await callDbConnection.connection.end()

        return {
            result: true,
            ingredient: null
        }
    }

    catch (err) {
        console.log('[ERROR] checkEtcIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}