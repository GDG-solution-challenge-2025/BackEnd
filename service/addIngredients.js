//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {insertIngredients} from '../repository/insertIngredients.js'

export async function addIngredients(session, ingredients) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 4
            }
        }

        const callInsertIngredients = await insertIngredients(callCheckExpireSession.uidx, ingredients)

        if (callInsertIngredients.result === false) {
            throw new Error()
        }

        return {
            result: true
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}