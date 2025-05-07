//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {updateLang} from '../repository/updateLang.js'

export async function changeLang(session, lang) {
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

        const callUpdateLang = await updateLang(callCheckExpireSession.uidx, lang)

        if (callUpdateLang.result === false) {
            throw new Error()
        }

        return {
            result: true
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}