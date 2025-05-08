import config from '../config.js'
import {exec} from 'child_process'
import {checkExpireSession} from '../function/checkExpireSession.js'
import {findIngredients} from '../repository/findIngredients.js'
import {findEtcIngredients} from '../repository/findEtcIngredients.js'
import {findUser} from '../repository/findUser.js'
import {insertSearch} from '../repository/insertSearch.js'

export async function postFoodAI(session, file) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) throw new Error()

        if (callCheckExpireSession.expire === true) {
            return { result: true, code: 3 }
        }

        const cant = []
        const callFindIngredients = await findIngredients(callCheckExpireSession.uidx)
        if (callFindIngredients.result === false) throw new Error()

        const allergenList = [
            ['pork', '돼지고기'], ['beef', '소고기'], ['horseMeat', '말고기'],
            ['chicken', '닭고기'], ['duck', '오리고기'], ['salmon', '연어'],
            ['tuna', '참치'], ['shrimp', '새우'], ['crab', '게'],
            ['lobster', '랍스터'], ['clam', '조개'], ['oyster', '굴'],
            ['mussel', '홍합'], ['scallop', '가리비'], ['milk', '우유'],
            ['cheese', '치즈'], ['butter', '버터'], ['wheat', '밀'],
            ['barley', '보리'], ['rice', '쌀'], ['corn', '옥수수'],
            ['soybean', '콩'], ['peanut', '땅콩'], ['almond', '아몬드'],
            ['cashewNut', '케슈너트']
        ]

        for (const [key, name] of allergenList) {
            if (callFindIngredients[key] === 1) cant.push(name)
        }

        const callFindEtcIngredients = await findEtcIngredients(callCheckExpireSession.uidx)
        if (callFindEtcIngredients.result === false) throw new Error()

        cant.push(...callFindEtcIngredients.ingredients)

        const cmd = `(echo ${config.filePath}/${file} & echo ${cant.join(', ')}) | "${config.pythonPath}" ${config.foodAI}`

        const result = await new Promise((resolve, reject) => {
            const child = exec(cmd, (error, stdout, stderr) => {
                if (error || stderr) return reject(new Error('Execution error'))
                resolve(stdout)
            })

            const timeout = setTimeout(() => {
                child.kill()
                reject(new Error('Timeout: No stdout within 1 minute'))
            }, 240000)
        })

        if (typeof result === 'string' && !result.includes('---___###@@@')) {
            throw new Error()
        }

        const parsed = result.split('---___###@@@').map(item => item.trim()).filter(Boolean)
        const nameKo = parsed[0]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const nameEn = parsed[2]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const descriptionKo = parsed[3]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const originKo = parsed[4]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const howToEatKo = parsed[5]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const ingredientsKo = parsed[6]?.replace(/`/g, '').trim().split(/\r?\n/).map(i => i.replace(/^\*\s*/, '').trim()).filter(Boolean)
        const cantIngredientsKo = parsed[7]?.replace(/`/g, '').trim().split(/\r?\n/).map(i => i.replace(/^\*\s*/, '').trim()).filter(Boolean)
        const descriptionEn = parsed[8]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const originEn = parsed[9]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const howToEatEn = parsed[10]?.replace(/`/g, '').replace(/\r?\n/g, '').trim()
        const ingredientsEn = parsed[11]?.replace(/`/g, '').trim().split(/\r?\n/).map(i => i.replace(/^\*\s*/, '').trim()).filter(Boolean)
        const cantIngredientsEn = parsed[12]?.replace(/`/g, '').trim().split(/\r?\n/).map(i => i.replace(/^\*\s*/, '').trim()).filter(Boolean)

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) throw new Error()

        const sidx = parseInt(file.match(/\d+/)[0].slice(-9), 10)
        const imgURL = config.serverIP + '/file/' + file
        const callInsertSearch = await insertSearch(sidx, callCheckExpireSession.uidx, imgURL, nameKo, descriptionKo, originKo, howToEatKo, ingredientsKo, cantIngredientsKo, nameEn, descriptionEn, originEn, howToEatEn, ingredientsEn, cantIngredientsEn)

        if (callInsertSearch.result === false) throw new Error()

        if (callFindUser.lang === 0) {
            return {
                result: true,
                sidx: sidx,
                imgURL: imgURL,
                name: nameKo,
                description: descriptionKo,
                origin: originKo,
                howToEat: howToEatKo,
                ingredients: ingredientsKo,
                cantIngredients: cantIngredientsKo
            }
        }

        if (callFindUser.lang === 1) {
            return {
                result: true,
                sidx: sidx,
                imgURL: imgURL,
                name: nameEn,
                description: descriptionEn,
                origin: originEn,
                howToEat: howToEatEn,
                ingredients: ingredientsEn,
                cantIngredients: cantIngredientsEn
            }
        }

    } catch (err) {
        return {
            result: false
        }
    }
}
