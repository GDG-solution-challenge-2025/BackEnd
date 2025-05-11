//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findLikeLimt} from '../repository/findLikeLimt.js'
import {findUser} from '../repository/findUser.js'

export async function getLikeRanking(session) {
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

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) {
            throw new Error()
        }

        const callFindLikeLimt = await findLikeLimt()

        if (callFindLikeLimt.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
            const foods = callFindLikeLimt.nameKo.map(item => {
                const { nameKo, ...rest } = item
                return { food: nameKo, ...rest }
            });
            return {
                result: true,
                foods: foods
            }
        }

        const foods = callFindLikeLimt.nameEn.map(item => {
            const { nameEn, ...rest } = item
            return { food: nameEn, ...rest }
        });

        return {
            result: true,
            foods: foods
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}