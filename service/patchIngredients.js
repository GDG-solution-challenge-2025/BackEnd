//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {updateIngredients} from '../repository/updateIngredients.js'

export async function patchIngredients(session, pork, beef, horseMeat, chicken, duck, salmon, tuna, shrimp, crab, lobster, clam, oyster, mussel, scallop, milk, cheese, butter, wheat, barley, rice, corn, soybean, peanut, almond, cashewNut) {
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

        const can = []
        const cant = []

        if (pork === 0) {
            can.push('pork')
        }
        else if (pork === 1) {
            cant.push('pork')
        }

        if (beef === 0) {
            can.push('beef')
        }
        else if (beef === 1) {
            cant.push('beef')
        }

        if (horseMeat === 0) {
            can.push('horseMeat')
        }
        else if (horseMeat === 1) {
            cant.push('horseMeat')
        }

        if (chicken === 0) {
            can.push('chicken')
        }
        else if (chicken === 1) {
            cant.push('chicken')
        }

        if (duck === 0) {
            can.push('duck')
        }
        else if (duck === 1) {
            cant.push('duck')
        }

        if (salmon === 0) {
            can.push('salmon')
        }
        else if (salmon === 1) {
            cant.push('salmon')
        }

        if (tuna === 0) {
            can.push('tuna')
        }
        else if (tuna === 1) {
            cant.push('tuna')
        }

        if (shrimp === 0) {
            can.push('shrimp')
        }
        else if (shrimp === 1) {
            cant.push('shrimp')
        }

        if (crab === 0) {
            can.push('crab')
        }
        else if (crab === 1) {
            cant.push('crab')
        }

        if (lobster === 0) {
            can.push('lobster')
        }
        else if (lobster === 1) {
            cant.push('lobster')
        }

        if (clam === 0) {
            can.push('clam')
        }
        else if (clam === 1) {
            cant.push('clam')
        }

        if (oyster === 0) {
            can.push('oyster')
        }
        else if (oyster === 1) {
            cant.push('oyster')
        }

        if (mussel === 0) {
            can.push('mussel')
        }
        else if (mussel === 1) {
            cant.push('mussel')
        }

        if (scallop === 0) {
            can.push('scallop')
        }
        else if (scallop === 1) {
            cant.push('scallop')
        }

        if (milk === 0) {
            can.push('milk')
        }
        else if (milk === 1) {
            cant.push('milk')
        }

        if (cheese === 0) {
            can.push('cheese')
        }
        else if (cheese === 1) {
            cant.push('cheese')
        }

        if (butter === 0) {
            can.push('butter')
        }
        else if (butter === 1) {
            cant.push('butter')
        }

        if (wheat === 0) {
            can.push('wheat')
        }
        else if (wheat === 1) {
            cant.push('wheat')
        }

        if (barley === 0) {
            can.push('barley')
        }
        else if (barley === 1) {
            cant.push('barley')
        }

        if (rice === 0) {
            can.push('rice')
        }
        else if (rice === 1) {
            cant.push('rice')
        }

        if (corn === 0) {
            can.push('corn')
        }
        else if (corn === 1) {
            cant.push('corn')
        }

        if (soybean === 0) {
            can.push('soybean')
        }
        else if (soybean === 1) {
            cant.push('soybean')
        }

        if (peanut === 0) {
            can.push('peanut')
        }
        else if (peanut === 1) {
            cant.push('peanut')
        }

        if (almond === 0) {
            can.push('almond')
        }
        else if (almond === 1) {
            cant.push('almond')
        }

        if (cashewNut === 0) {
            can.push('cashewNut')
        }
        else if (cashewNut === 1) {
            cant.push('cashewNut')
        }

        const callUpdateIngredients = await updateIngredients(callCheckExpireSession.uidx, can, cant)

        if (callUpdateIngredients.result === false) {
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