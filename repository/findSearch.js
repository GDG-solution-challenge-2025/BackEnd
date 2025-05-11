//function
import {dbConnection} from '../function/dbConnection.js'

export async function findSearch(sidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM search WHERE sidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [sidx])
        await callDbConnection.connection.end()

        if (rows.length === 0) {
            throw new Error('rows not found')
        }

        return {
            result: true,
            sidx: rows[0].sidx,
            uidx: rows[0].uidx,
            imgURL: rows[0].imgURL,
            nameKo: rows[0].nameKo,
            descriptionKo: rows[0].descriptionKo,
            originKo: rows[0].originKo,
            howToEatKo: rows[0].howToEatKo,
            ingredientsKo: JSON.parse(rows[0].ingredientsKo),
            cantIngredientsKo: JSON.parse(rows[0].ingredientsKo),
            nameEn: rows[0].nameEn,
            descriptionEn: rows[0].descriptionEn,
            originEn: rows[0].originEn,
            howToEatEn: rows[0].howToEatEn,
            ingredientsEn: JSON.parse(rows[0].ingredientsEn),
            cantIngredientsEn: JSON.parse(rows[0].ingredientsEn)
        }
    }

    catch (err) {
        console.log('[ERROR] findSearch')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}