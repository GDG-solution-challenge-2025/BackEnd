//function
import {dbConnection} from '../function/dbConnection.js'

export async function updateLang(uidx, lang) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'UPDATE users SET lang = ? WHERE uidx = ?'
        const [result] = await callDbConnection.connection.execute(query, [lang, uidx])
        await callDbConnection.connection.end()

        if (result.affectedRows === 0) {
            throw new Error('query: UPDATE users SET ' + lang + ' WHERE ' + uidx)
        }

        return {
            result: true,
        }
    }

    catch (err) {
        console.log('[ERROR] updateLang')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}