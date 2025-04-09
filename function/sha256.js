//node module
import crypto from 'crypto'

export async function sha256(word) {
    try {
        const hash = crypto.createHash('sha256').update(word).digest('hex')

        return {
            result: true,
            hash: hash
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}