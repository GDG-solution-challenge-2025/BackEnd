import config from '../config.js'
import {exec} from 'child_process'
import {checkExpireSession} from '../function/checkExpireSession.js'
import {findUser} from '../repository/findUser.js'

export async function postOcrAI(session, file) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) throw new Error()

        if (callCheckExpireSession.expire === true) {
            return { result: true, code: 3 }
        }

        const cmd = `(echo ${config.filePath}/${file}) | "${config.pythonPath}" ${config.ocrAI}`

        const result = await new Promise((resolve, reject) => {
            const child = exec(cmd, (error, stdout, stderr) => {
                if (error || stderr) return reject(new Error('Execution error'))
                resolve(stdout)
            })

            const timeout = setTimeout(() => {
                child.kill()
                reject(new Error('Timeout: No stdout within 1 minute'))
            }, 60000)
        })

        if (typeof result === 'string' && !result.includes('---___###@@@')) {
            throw new Error()
        }

        const [koPart, enPart] = result.split('@@ko/eng@@');

        const parseSection = (text) => {
            return text
                .split('---___###@@@')
                .map(str => str.replace(/[\r\n`]/g, '').trim())
                .filter(str => str.length > 0)
        }

        const menuKo = parseSection(koPart)
        const menuEn = parseSection(enPart)
        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) throw new Error()

        if (callFindUser.lang === 0) {
            return {
                result: true,
                menu: menuKo
            }
        }

        if (callFindUser.lang === 1) {
            return {
                result: true,
                menu: menuEn
            }
        }

    } catch (err) {
        return {
            result: false
        }
    }
}