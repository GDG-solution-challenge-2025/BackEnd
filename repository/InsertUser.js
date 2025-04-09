//function
import {dbConnection} from '../function/dbConnection.js'

export async function insertUser(id, pw, name) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'INSERT INTO users (id, pw, changeName) VALUES (?,?,?)'
        const [result] = await callDbConnection.connection.execute(query, [id, pw, name])
        await callDbConnection.connection.end()

        if (result.affectedRows === 0) {
            throw new Error('query: INSERT INTO users ' + id + ', ' + pw + ', ' + name)
        }

        return {
            result: true
        }
    }

    catch (err) {
        console.log('[ERROR] InsertUser')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}