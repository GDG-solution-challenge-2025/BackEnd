//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {insertEtcIngredients} from '../repository/insertEtcIngredients.js'
import {checkEtcIngredients} from '../repository/checkEtcIngredients.js'

export async function addOthersIngredients(session, ingredients) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 5
            }
        }

        const callcheckEtcIngredients = await checkEtcIngredients(callCheckExpireSession.uidx, ingredients)

        if (callcheckEtcIngredients.result === false) {
            throw new Error()
        }

        if (callcheckEtcIngredients.ingredient !== null) {
            return {
                result: true,
                code: 6,
                ingredient: callcheckEtcIngredients.ingredient
            }
        }

        const callinsertEtcIngredients = await insertEtcIngredients(callCheckExpireSession.uidx, ingredients)

        if (callinsertEtcIngredients.result === false) {
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