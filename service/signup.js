//function
import {sha256} from '../function/sha256.js'

//repository
import {duplicatedId} from '../repository/duplicatedId.js'
import {insertUser} from '../repository/InsertUser.js'

export async function signup(id, name, pw) {
    try {
        const callDuplicatedId = await duplicatedId(id)

        if (callDuplicatedId.result === false) {
            throw new Error()
        }

        if (callDuplicatedId.dubplicate === true) {
            return {
                result: true,
                code: 4
            }
        }

        const word = id + pw
        const callSha256 = await sha256(word)

        if (callSha256.result === false) {
            throw new Error()
        }

        const callInsertUser = await insertUser(id, callSha256.hash, name);

        if (callInsertUser.result === false) {
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