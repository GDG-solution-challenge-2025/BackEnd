//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findSearch} from '../repository/findSearch.js'
import {findUser} from '../repository/findUser.js'

export async function getSearchDetail(session, sidx) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 3
            }
        }

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) {
            throw new Error()
        }

        const callFindSearch = await findSearch(sidx)

        if (callFindSearch.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
            return {
                result: true,
                sidx: callFindSearch.sidx,
                imgURL: callFindSearch.imgURL,
                name: callFindSearch.nameKo,
                description: callFindSearch.descriptionKo,
                origin: callFindSearch.originKo,
                howToEat: callFindSearch.howToEatKo,
                ingredients: callFindSearch.ingredientsKo,
                cantIngredients: callFindSearch.ingredientsKo,
            }
        }

        return {
            result: true,
            sidx: callFindSearch.sidx,
            imgURL: callFindSearch.imgURL,
            name: callFindSearch.nameEn,
            description: callFindSearch.descriptionEn,
            origin: callFindSearch.originEn,
            howToEat: callFindSearch.howToEatEn,
            ingredients: callFindSearch.ingredientsEn,
            cantIngredients: callFindSearch.ingredientsEn,
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}