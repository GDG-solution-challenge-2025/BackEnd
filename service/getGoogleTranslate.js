//function
import {checkExpireSession} from '../function/checkExpireSession.js'

//repository
import {findUser} from '../repository/findUser.js'
import {findIngredients} from '../repository/findIngredients.js'
import {findEtcIngredients} from '../repository/findEtcIngredients.js'

export async function getGoogleTranslate(session) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 2
            }
        }

        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) {
            throw new Error()
        }

        if (callFindUser.lang === 0) {
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
            const textToTranslate = cant.join(', ') + ' 식재료를 먹지 못합니다.'
            const encodedText = encodeURIComponent(textToTranslate)
            const url = `https://translate.google.com/?sl=ko&tl=en&text=${encodedText}&op=translate`

            return {
                result: true,
                url: url
            }
        }

        const cant = []
        const callFindIngredients = await findIngredients(callCheckExpireSession.uidx)
        if (callFindIngredients.result === false) throw new Error()

        const allergenList = [
            ['pork', 'pork'], ['beef', 'beef'], ['horseMeat', 'horseMeat'],
            ['chicken', 'chicken'], ['duck', 'duck'], ['salmon', 'salmon'],
            ['tuna', 'tuna'], ['shrimp', 'shrimp'], ['crab', 'crab'],
            ['lobster', 'lobster'], ['clam', 'clam'], ['oyster', 'oyster'],
            ['mussel', 'mussel'], ['scallop', 'scallop'], ['milk', 'milk'],
            ['cheese', 'cheese'], ['butter', 'butter'], ['wheat', 'wheat'],
            ['barley', 'barley'], ['rice', 'rice'], ['corn', 'corn'],
            ['soybean', 'soybean'], ['peanut', 'peanut'], ['almond', 'almond'],
            ['cashewNut', 'cashewNut']
        ]

        for (const [key, name] of allergenList) {
            if (callFindIngredients[key] === 1) cant.push(name)
        }

        const callFindEtcIngredients = await findEtcIngredients(callCheckExpireSession.uidx)
        if (callFindEtcIngredients.result === false) throw new Error()

        cant.push(...callFindEtcIngredients.ingredients)
        const textToTranslate = 'I cannot eat' + cant.join(', ')
        const encodedText = encodeURIComponent(textToTranslate)
        const url = `https://translate.google.com/?sl=en&tl=ko&text=${encodedText}&op=translate`

        return {
            result: true,
            url: url
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}