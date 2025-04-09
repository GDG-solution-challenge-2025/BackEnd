//node module
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

//config
import config from './config.js'

//service
import {signup} from './service/signup.js'
import {checkId} from './service/checkId.js'
import {login} from './service/login.js'
import {sessionLogin} from './service/sessionLogin.js'
import {changeName} from './service/changeName.js'
import {changePassword} from './service/changePassword.js'
import {addIngredients} from './service/addIngredients.js'

//middleware
const app = express()
app.use(bodyParser.json())
app.use(cors())

//POST signup
app.post('/signup', async function (req, res) {
   const {id, pw, name} = req.body
   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/

   if (!id || id.length < 3 || id.length > 50) {
       return res.status(400).json({
           code: 1,
           message: 'id는 3자 이상 50자 이하입니다.'
       })
   }

    if (!name || name.length > 50) {
        return res.status(400).json({
            code: 2,
            message: 'name은 1자 이상 50자 이하입니다.'
        })
    }

   if (!pw || pw.length < 8 || pw.length > 50 || !regex.test(pw)) {
       return res.status(400).json({
          code: 3,
          message: 'pw는 8자 이상 50자 이하, 정규식(소문자, 대문자, 숫자, 특수기호)을 충족해야 합니다.'
       })
   }

   const callSignup = await signup(id, name, pw)

    if (callSignup.code === 4) {
        return res.status(400).json({
            code: 4,
            message: '중복된 id입니다.'
        })
    }

    if (callSignup.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callSignup.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//GET checkId
app.get('/checkId', async function (req, res) {
    const {id} = req.body

    if (!id || id.length > 50) {
        return res.status(400).json({
            code: 1,
            message: 'id는 1자 이상 50자 이하입니다.'
        })
    }

    const callCheckId = await checkId(id)

    if (callCheckId.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callCheckId.result === true) {
        return res.status(200).json({
            duplicate: callCheckId.duplicate
        })
    }
})

//POST login
app.post('/login', async function (req, res) {
    const {id, pw} = req.body

    if (!id || id.length > 50) {
        return res.status(400).json({
            code: 1,
            message: 'id는 1자 이상 50자 이하입니다.'
        })
    }

    if (!pw || pw.length > 50) {
        return res.status(400).json({
            code: 2,
            message: 'pw는 1자 이상 50자 이하입니다.'
        })
    }

    const callLogin = await login(id, pw)

    if (callLogin.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'id 혹은 pw가 일치하지 않습니다.'
        })
    }

    if (callLogin.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callLogin.result === true) {
        return res.status(200).json({
            id: callLogin.id,
            name: callLogin.name,
            session: callLogin.session,
            expire: callLogin.expire
        })
    }
})

//POST sessionLogin
app.post('/sessionLogin', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callSessionLogin = await sessionLogin(session)

    if (callSessionLogin.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callSessionLogin.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callSessionLogin.result === true) {
        return res.status(200).json({
            id: callSessionLogin.id,
            name: callSessionLogin.name,
            session: callSessionLogin.session,
            expire: callSessionLogin.expire
        })
    }
})

//PATCH name
app.patch('/name', async function (req, res) {
    const {session, name} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!name || name.length > 50) {
        return res.status(400).json({
            code: 2,
            message: 'name은 1자 이상 50자 이하입니다.'
        })
    }

    const callChangeName = await changeName(session, name)

    if (callChangeName.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callChangeName.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callChangeName.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//PATCH password
app.patch('/password', async function (req, res) {
    const {session, pw, newPw} = req.body
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!pw || pw.length > 50) {
        return res.status(400).json({
            code: 2,
            message: 'pw는 1자 이상 50자 이하입니다.'
        })
    }

    if (!newPw || newPw.length < 8 || newPw.length > 50 || !regex.test(newPw)) {
        return res.status(400).json({
            code: 3,
            message: 'newPw는 8자 이상 50자 이하, 정규식(소문자, 대문자, 숫자, 특수기호)을 충족해야 합니다.'
        })
    }

    const callChangePassword = await changePassword(session, pw, newPw)

    if (callChangePassword.code === 4) {
        return res.status(400).json({
            code: 4,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callChangePassword.code === 5) {
        return res.status(400).json({
            code: 5,
            message: 'pw가 일치하지 않습니다.'
        })
    }

    if (callChangePassword.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callChangePassword.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//PUT ingredients
app.put('/ingredients', async function (req, res) {
    const {session, ingredients} = req.body
    const regex = /^[a-zA-Z0-9가-힣\s]+$/;


    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({
            code: 2,
            message: 'ingredients는 1개 이상의 요소가 필요합니다.'
        })
    }

    for (let i = 0; i < ingredients.length; i++) {
        if (ingredients[i] < 1 || ingredients[i] > 50 || !regex.test(ingredients[i])) {
            return res.status(400).json({
                code: 3,
                message: 'ingredients의 요소는 1자 이상 50자 이하, 정규식(특수기호 미포함)을 충족해야 합니다.'
            })
        }
    }

    const callAddIngredients = await addIngredients(session, ingredients)

    if (callAddIngredients.code === 4) {
        return res.status(400).json({
            code: 4,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callAddIngredients.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callAddIngredients.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

app.listen(config.port)