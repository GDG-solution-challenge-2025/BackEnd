//config
import config from '../config.js'

//function
import {checkExpireSession} from '../function/checkExpireSession.js'
import {expireDate} from '../function/expireDate.js'

//repository
import {findUser} from '../repository/findUser.js'
import {deleteSession} from '../repository/deleteSession.js'
import {insertSession} from '../repository/insertSession.js'

export async function sessionLogin(session) {
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

        const callDeleteSession = await deleteSession(callFindUser.uidx)

        if (callDeleteSession.result === false) {
            throw new Error()
        }

        const callExpireDate = await expireDate(config.session)

        if (callExpireDate.result === false) {
            throw new Error()
        }

        const callInsertSession = await insertSession(callFindUser.uidx, session, callExpireDate.date)

        if (callInsertSession.result === false) {
            throw new Error()
        }

        return {
            result: true,
            id: callFindUser.id,
            name: callFindUser.name,
            lang: callFindUser.lang,
            session: session,
            expire: callExpireDate.date
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}