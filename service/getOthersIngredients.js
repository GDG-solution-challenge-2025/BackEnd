//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findEtcIngredients} from '../repository/findEtcIngredients.js'

export async function getOthersIngredients(session) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 2
            }
        }

        const callFindEtcIngredients = await findEtcIngredients(callCheckExpireSession.uidx)

        if (callFindEtcIngredients.result === false) {
            throw new Error()
        }

        return {
            result: true,
            ingredients: callFindEtcIngredients.ingredients
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}