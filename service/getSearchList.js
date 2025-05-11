//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findSearchAll} from '../repository/findSearchAll.js'
import {findUser} from '../repository/findUser.js'

export async function getSearchList(session) {
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

        const callFindSearchAll = await findSearchAll(callCheckExpireSession.uidx)

        if (callFindSearchAll.result === false) {
            throw new Error()
        }

        if (callFindSearchAll.searchList.length === 0) {
            return {
                result: true,
                searchList: []
            }
        }

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
            const searchList = callFindSearchAll.searchList.map(search => ({
                sidx: search.sidx,
                imgURL: search.imgURL,
                name: search.nameKo
            }));

            return {
                result: true,
                searchList: searchList.reverse()
            }
        }

        if (callFindUser.lang === 1) {
            const searchList = callFindSearchAll.searchList.map(search => ({
                sidx: search.sidx,
                imgURL: search.imgURL,
                name: search.nameEn
            }));

            return {
                result: true,
                searchList: searchList.reverse()
            }
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}