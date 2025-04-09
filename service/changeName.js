//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {updateName} from '../repository/updateName.js'

export async function changeName(session, name) {
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

        const callUpdateName = await updateName(callCheckExpireSession.uidx, name)

        if (callUpdateName.result === false) {
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