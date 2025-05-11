//function
import {dbConnection} from '../function/dbConnection.js'

export async function findLikeLimt() {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query1 = 'SELECT nameKo, COUNT(*) as count  FROM likes  GROUP BY nameKo  ORDER BY count DESC LIMIT 5'
        const [nameKo] = await callDbConnection.connection.execute(query1)
        const query2 = 'SELECT nameEn, COUNT(*) as count  FROM likes  GROUP BY nameEn  ORDER BY count DESC LIMIT 5'
        const [nameEn] = await callDbConnection.connection.execute(query2)
        await callDbConnection.connection.end()

        return {
            result: true,
            nameKo: nameKo,
            nameEn: nameEn
        }
    }

    catch (err) {
        console.log('[ERROR] findLikeLimt')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}