//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findSearchLandom10} from '../repository/findSearchLandom10.js'
import {findUser} from '../repository/findUser.js'

export async function getSearchRandom10(session) {
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

        const callFindSearchLandom10 = await findSearchLandom10()

        if (callFindSearchLandom10.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
            const foods = callFindSearchLandom10.nameKo.map(item => {
                const { nameKo, ...rest } = item
                return { food: nameKo, ...rest }
            });
            return {
                result: true,
                foods: foods
            }
        }

        const foods = callFindSearchLandom10.nameEn.map(item => {
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