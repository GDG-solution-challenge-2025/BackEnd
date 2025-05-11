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
                sidx: callFindUser.sidx,
                imgURL: callFindUser.imgURL,
                name: callFindUser.nameKo,
                description: callFindUser.descriptionKo,
                origin: callFindUser.originKo,
                howToEat: callFindUser.howToEatKo,
                ingredients: callFindUser.ingredientsKo,
                cantIngredients: callFindUser.ingredientsKo,
            }
        }

        return {
            result: true,
            sidx: callFindUser.sidx,
            imgURL: callFindUser.imgURL,
            name: callFindUser.nameEn,
            description: callFindUser.descriptionEn,
            origin: callFindUser.originEn,
            howToEat: callFindUser.howToEatEn,
            ingredients: callFindUser.ingredientsEn,
            cantIngredients: callFindUser.ingredientsEn,
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}