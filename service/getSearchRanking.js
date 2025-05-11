//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findSearchLimt} from '../repository/findSearchLimt.js'
import {findUser} from '../repository/findUser.js'

export async function getSearchRanking(session) {
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

        const callFindSearchLimt = await findSearchLimt()

        if (callFindSearchLimt.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
            const foods = callFindSearchLimt.nameKo.map(item => {
                const { nameKo, ...rest } = item
                return { food: nameKo, ...rest }
            });
            return {
                result: true,
                foods: foods
            }
        }

        const foods = callFindSearchLimt.nameEn.map(item => {
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