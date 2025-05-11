//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findLike} from '../repository/findLike.js'

export async function getFoodLike(session, sidx) {
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

        const callFindLike = await findLike(sidx)

        if (callFindLike.result === false) {
            throw new Error()
        }

        if (callFindLike.like.length === 0) {
            return {
                result: true,
                like: 0
            }
        }

        return {
            result: true,
            like: 1
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}