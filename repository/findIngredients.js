//function
import {dbConnection} from '../function/dbConnection.js'

export async function findIngredients(uidx) {
    try {
        const callDbConnection = await dbConnection()

        if (callDbConnection.result === false) {
            throw new Error('dbConnection')
        }

        const query = 'SELECT * FROM users WHERE uidx = ?'
        const [rows] = await callDbConnection.connection.execute(query, [uidx])
        await callDbConnection.connection.end()

        return {
            result: true,
            pork: rows[0].pork,
            beef: rows[0].beef,
            horseMeat: rows[0].horseMeat,
            chicken: rows[0].chicken,
            duck: rows[0].duck,
            salmon: rows[0].salmon,
            tuna: rows[0].tuna,
            shrimp: rows[0].shrimp,
            crab: rows[0].crab,
            lobster: rows[0].lobster,
            clam: rows[0].clam,
            oyster: rows[0].oyster,
            mussel: rows[0].mussel,
            scallop: rows[0].scallop,
            milk: rows[0].milk,
            cheese: rows[0].cheese,
            butter: rows[0].butter,
            wheat: rows[0].wheat,
            barley: rows[0].barley,
            rice: rows[0].rice,
            corn: rows[0].corn,
            soybean: rows[0].soybean,
            peanut: rows[0].peanut,
            almond: rows[0].almond,
            cashewNut: rows[0].cashewNut
        }
    }

    catch (err) {
        console.log('[ERROR] findIngredients')
        console.log(err + '\n\n')

        return {
            result: false
        }
    }
}