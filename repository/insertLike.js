//function
import {dbConnection} from '../function/dbConnection.js'

export async function insertLike(sidx, uidx, nameKo, nameEn) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'INSERT INTO likes (sidx, uidx, nameKo, nameEn) VALUES (?,?,?,?)'
        const [result] = await callDbConnection.connection.execute(query, [sidx, uidx, nameKo, nameEn])
        await callDbConnection.connection.end()

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] insertLike')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}