//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {deleteEtcIngredients} from '../repository/deleteEtcIngredients.js'
import {checkEtcIngredients} from '../repository/checkEtcIngredients.js'

export async function deleteOthersIngredients(session, ingredients) {
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

        for (let i = 0; i < ingredients.length; i++) {
            const callcheckEtcIngredients = await checkEtcIngredients(callCheckExpireSession.uidx, [ingredients[i]])
            if (callcheckEtcIngredients.result === false) {
                throw new Error()
            }

            if (callcheckEtcIngredients.ingredient === null) {
                return {
                    result: true,
                    code: 6,
                    ingredient: ingredients[i]
                }
            }
        }

        const callDeleteEtcIngredients = await deleteEtcIngredients(callCheckExpireSession.uidx, ingredients)

        if (callDeleteEtcIngredients.result === false) {
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