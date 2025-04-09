//config
import config from '../config.js'

//function
import {sha256} from '../function/sha256.js'
import {expireDate} from '../function/expireDate.js'

//repository
import {checkUser} from '../repository/checkUser.js'
import {findSession} from '../repository/findSession.js'
import {deleteSession} from '../repository/deleteSession.js'
import {insertSession} from '../repository/insertSession.js'

export async function login(id, pw) {
    try {
        var word = id + pw
        var callSha256 = await sha256(word)

        if (callSha256.result === false) {
            throw new Error()
        }

        const callCheckUser = await checkUser(id, callSha256.hash)

        if (callCheckUser.result === false) {
            throw new Error()
        }

        if (callCheckUser.uidx === null) {
            return {
                result: true,
                code: 3
            }
        }

        const callFindSession = await findSession(callCheckUser.uidx)

        if (callFindSession.result === false) {
            throw new Error()
        }

        if (callFindSession.session !== null) {
            const callDeleteSession = await deleteSession(callCheckUser.uidx)

            if (callDeleteSession.result === false) {
                throw new Error()
            }
        }

        const callExpireDate = await expireDate(config.session)

        if (callExpireDate.result === false) {
            throw new Error()
        }

        var word = id + pw + callExpireDate.date
        var callSha256 = await sha256(word)

        if (callSha256.result === false) {
            throw new Error()
        }

        const callInsertSession = await insertSession(callCheckUser.uidx, callSha256.hash, callExpireDate.date)

        if (callInsertSession.result === false) {
            throw new Error()
        }

        return {
            result: true,
            id: id,
            name: callCheckUser.name,
            session: callSha256.hash,
            expire: callExpireDate.date
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}