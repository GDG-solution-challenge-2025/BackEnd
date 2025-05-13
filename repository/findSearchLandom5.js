//function
import {dbConnection} from '../function/dbConnection.js'

export async function findSearchLandom5() {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query1 = 'SELECT nameKo, ANY_VALUE(imgURL) AS imgURL FROM search GROUP BY nameKo ORDER BY RAND() LIMIT 5'
        const [nameKo] = await callDbConnection.connection.execute(query1)
        const query2 = 'SELECT nameEn, ANY_VALUE(imgURL) AS imgURL FROM search GROUP BY nameEn ORDER BY RAND() LIMIT 5'
        const [nameEn] = await callDbConnection.connection.execute(query2)
        await callDbConnection.connection.end()

        return {
            result: true,
            nameKo: nameKo,
            nameEn: nameEn
        }
    }

    catch (err) {
        console.log('[ERROR] findSearchLandom5')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}