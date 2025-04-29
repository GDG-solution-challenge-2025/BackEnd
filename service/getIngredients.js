//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findIngredients} from '../repository/findIngredients.js'

export async function getIngredients(session) {
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

        const callFindIngredients = await findIngredients(callCheckExpireSession.uidx)

        if (callFindIngredients.result === false) {
            throw new Error()
        }

        return {
            result: true,
            pork: callFindIngredients.pork,
            beef: callFindIngredients.beef,
            horseMeat: callFindIngredients.horseMeat,
            chicken: callFindIngredients.chicken,
            duck: callFindIngredients.duck,
            salmon: callFindIngredients.salmon,
            tuna: callFindIngredients.tuna,
            shrimp: callFindIngredients.shrimp,
            crab: callFindIngredients.crab,
            lobster: callFindIngredients.lobster,
            clam: callFindIngredients.clam,
            oyster: callFindIngredients.oyster,
            mussel: callFindIngredients.mussel,
            scallop: callFindIngredients.scallop,
            milk: callFindIngredients.milk,
            cheese: callFindIngredients.cheese,
            butter: callFindIngredients.butter,
            wheat: callFindIngredients.wheat,
            barley: callFindIngredients.barley,
            rice: callFindIngredients.rice,
            corn: callFindIngredients.corn,
            soybean: callFindIngredients.soybean,
            peanut: callFindIngredients.peanut,
            almond: callFindIngredients.almond,
            cashewNut: callFindIngredients.cashewNut
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}