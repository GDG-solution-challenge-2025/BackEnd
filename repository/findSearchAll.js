//function
import {dbConnection} from '../function/dbConnection.js'

export async function findSearchAll(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT sidx, imgURL, nameKo, nameEn FROM search WHERE uidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        return {
            result: true,
            searchList: rows
        }
    }

    catch (err) {
        console.log('[ERROR] findSearchAll')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}