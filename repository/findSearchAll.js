//function
import {dbConnection} from '../function/dbConnection.js'

export async function findSearchAll(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query1 = 'SELECT sidx, date, imgURL, nameKo, nameEn FROM search WHERE uidx = ?'
        const [rows1] = await callDbConnection.connection.execute(query1, [uidx])
        const query2 = 'SELECT sidx FROM likes WHERE uidx = ?'
        const [rows2] = await callDbConnection.connection.execute(query2, [uidx])
        await callDbConnection.connection.end()

        const sidxSet = new Set(rows2.map(item => item.sidx))
        const mergedRows = rows1.map(item => {
            return {
                ...item,
                like: sidxSet.has(item.sidx) ? 1 : 0
            }
        })

        return {
            result: true,
            searchList: mergedRows
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