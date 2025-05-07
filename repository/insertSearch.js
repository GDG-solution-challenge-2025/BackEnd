//function
import {dbConnection} from '../function/dbConnection.js'

export async function insertSearch(sidx, uidx, imgURL, nameKo, descriptionKo, originKo, howToEatKo, ingredientsKo, cantIngredientsKo, nameEn, descriptionEn, originEn, howToEatEn, ingredientsEn, cantIngredientsEn) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'INSERT INTO search (sidx, uidx, imgURL, nameKo, descriptionKo, originKo, howToEatKo, ingredientsKo, cantIngredientsKo, nameEn, descriptionEn, originEn, howToEatEn, ingredientsEn, cantIngredientsEn) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        const [result] = await callDbConnection.connection.execute(query, [sidx, uidx, imgURL, nameKo, descriptionKo, originKo, howToEatKo, ingredientsKo, cantIngredientsKo, nameEn, descriptionEn, originEn, howToEatEn, ingredientsEn, cantIngredientsEn])
        await callDbConnection.connection.end()

        if (result.affectedRows === 0) {
            throw new Error('query: INSERT INTO search ' + sidx + ', ' + uidx + ', ' + imgURL)
        }

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] InsertSearch')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}