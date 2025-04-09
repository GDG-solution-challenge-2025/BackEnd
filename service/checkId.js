//repository
import {duplicatedId} from '../repository/duplicatedId.js'

export async function checkId(id) {
    try {
        const callDuplicatedId = await duplicatedId(id)

        if (callDuplicatedId.result === false) {
            throw new Error()
        }

        if (callDuplicatedId.dubplicate === true) {
            return {
                result: true,
                duplicate: true
            }
        }

        return {
            result: true,
            duplicate: false
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}