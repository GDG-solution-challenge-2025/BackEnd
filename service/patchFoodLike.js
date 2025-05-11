//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findSearch} from '../repository/findSearch.js'
import {insertLike} from '../repository/insertLike.js'
import {deleteLike} from '../repository/deleteLike.js'

export async function patchFoodLike(session, sidx, like) {
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

        const callFindSearch = await findSearch(sidx)

        if (callFindSearch.result === false) {
            throw new Error()
        }

        if (like === 1) {
            const callInsertLike = await insertLike(sidx, callCheckExpireSession.uidx ,callFindSearch.nameKo, callFindSearch.nameEn)

            if (callInsertLike.result === false) {
                throw new Error()
            }

            return {
                result: true
            }
        }
        else if (like === 0) {
            const callDeleteLike = await deleteLike(sidx)

            if (callDeleteLike.result === false) {
                throw new Error()
            }

            return {
                result: true
            }
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}