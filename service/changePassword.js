//function
import {checkExpireSession} from '../function/checkExpireSession.js'
import {sha256} from '../function/sha256.js'

//repository
import {findUser} from '../repository/findUser.js'
import {checkUser} from '../repository/checkUser.js'
import {updatePassword} from '../repository/updatePassword.js'
import {deleteSession} from '../repository/deleteSession.js'

export async function changePassword(session, pw, newPw) {
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

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser === false) {
            throw new Error()
        }

        var word = callFindUser.id + pw
        var callSha256 = await sha256(word)

        if (callSha256.result === false) {
            throw new Error()
        }

        const callCheckUser = await checkUser(callFindUser.id, callSha256.hash)

        if (callCheckUser.result === false) {
            throw new Error()
        }

        if (callCheckUser.uidx === null) {
            return {
                result: true,
                code: 5
            }
        }

        var word = callFindUser.id + newPw
        var callSha256 = await sha256(word)

        if (callSha256.result === false) {
            throw new Error()
        }

        const callUpdatePassword = await updatePassword(callFindUser.uidx, callSha256.hash)

        if (callUpdatePassword.result === false) {
            throw new Error()
        }

        const callDeleteSession = await deleteSession(callFindUser.uidx)

        if (callDeleteSession.result === false) {
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