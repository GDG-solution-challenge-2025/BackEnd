//repository
import {checkSession} from '../repository/checkSession.js'

export async function checkExpireSession(session) {
    try {
        const callCheckSession = await checkSession(session)

        if (callCheckSession.result === false) {
            throw new Error()
        }

        if (callCheckSession.uidx === null) {
            return {
                result: true,
                uidx: null,
                expire: true
            }
        }

        const date = new Date()
        const expire = new Date(callCheckSession.expire + 'Z')

        if (expire < date) {
            return {
                result: true,
                uidx: callCheckSession.uidx,
                expire: true
            }
        }

        return {
            result: true,
            uidx: callCheckSession.uidx,
            expire: false
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}