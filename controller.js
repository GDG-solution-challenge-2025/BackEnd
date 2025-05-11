//node module
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer'
import path from 'path';

//config
import config from './config.js'

//service
import {signup} from './service/signup.js'
import {checkId} from './service/checkId.js'
import {login} from './service/login.js'
import {sessionLogin} from './service/sessionLogin.js'
import {changeName} from './service/changeName.js'
import {changePassword} from './service/changePassword.js'
import {changeLang} from './service/changeLang.js'
import {addOthersIngredients} from './service/addOthersIngredients.js'
import {deleteOthersIngredients} from './service/deleteOthersIngredients.js'
import {getOthersIngredients} from './service/getOthersIngredients.js'
import {getIngredients} from './service/getIngredients.js'
import {patchIngredients} from './service/patchIngredients.js'
import {postFoodAI} from './service/postFoodAI.js'
import {postGoogleMap} from './service/postGoogleMap.js'
import {getSearchList} from './service/getSearchList.js'
import {patchFoodLike} from './service/patchFoodLike.js'
import {getFoodLike} from './service/getFoodLike.js'
import {getSearchDetail} from './service/getSearchDetail.js'
import {getLikeRanking} from './service/getLikeRanking.js'
import {getSearchRanking} from './service/getSearchRanking.js'
import {postOcrAI} from './service/postOcrAI.js'
import {postTextAI} from './service/postTextAI.js'
import {getGoogleTranslate} from './service/getGoogleTranslate.js'

//middleware
const app = express()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.filePath);
    },
    filename: (req, file, cb) => {
        const extname = path.extname(file.originalname);
        const randomNum = Math.floor(Math.random() * 1e13)
            .toString()
            .padStart(13, '0');
        cb(null, `${randomNum}${extname}`);
    }
});
const upload = multer({
    storage: storage
});
app.use(bodyParser.json())
app.use(cors())

//POST signup
app.post('/signup', async function (req, res) {
   const {id, pw, name, lang} = req.body
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

   if (lang !== 0 && lang !== 1) {
       return res.status(400).json({
           code: 4,
           message: 'lang은 0혹은 1입니다.(0:한국어 1:영어)'
       })
   }

   const callSignup = await signup(id, name, pw, lang)

    if (callSignup.code === 5) {
        return res.status(400).json({
            code: 5,
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
            lang: callLogin.lang,
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
            lang: callSessionLogin.lang,
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

//PATCH lang
app.patch('/lang', async function (req, res) {
    const {session, lang} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (lang !== 0 && lang !== 1) {
        return res.status(400).json({
            code: 2,
            message: 'lang은 0혹은 1입니다.(0:한국어 1:영어)'
        })
    }

    const callChangeLang = await changeLang(session, lang)

    if (callChangeLang.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callChangeLang.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callChangeLang.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//PUT othersIngredients
app.put('/othersIngredients', async function (req, res) {
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

    if (new Set(ingredients).size !== ingredients.length) {
        return res.status(400).json({
            code: 4,
            message: 'ingredients의 요소 중 중복된 요소가 있습니다.'
        })
    }

    const callAddIngredients = await addOthersIngredients(session, ingredients)

    if (callAddIngredients.code === 5) {
        return res.status(400).json({
            code: 5,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callAddIngredients.code === 6) {
        return res.status(400).json({
            code: 6,
            message: '이미 등록된 ingredient가 있습니다.',
            ingredient: callAddIngredients.ingredient
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

//DELETE othersIngredients
app.delete('/othersIngredients', async function (req, res) {
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

    if (new Set(ingredients).size !== ingredients.length) {
        return res.status(400).json({
            code: 4,
            message: 'ingredients의 요소 중 중복된 요소가 있습니다.'
        })
    }

    const callDeleteOthersIngredients = await deleteOthersIngredients(session, ingredients)

    if (callDeleteOthersIngredients.code === 5) {
        return res.status(400).json({
            code: 5,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callDeleteOthersIngredients.code === 6) {
        return res.status(400).json({
            code: 6,
            message: '등록되지 않은 ingredient가 있습니다.',
            ingredient: callDeleteOthersIngredients.ingredient
        })
    }

    if (callDeleteOthersIngredients.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callDeleteOthersIngredients.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//GET othersIngredients
app.get('/othersIngredients', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetOthersIngredients = await getOthersIngredients(session)

    if (callGetOthersIngredients.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetOthersIngredients.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetOthersIngredients.result === true) {
        return res.status(200).json({
            ingredients: callGetOthersIngredients.ingredients
        })
    }
})

//GET ingredients
app.get('/ingredients', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetIngredients = await getIngredients(session)

    if (callGetIngredients.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetIngredients.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetIngredients.result === true) {
        return res.status(200).json({
            pork: callGetIngredients.pork,
            beef: callGetIngredients.beef,
            horseMeat: callGetIngredients.horseMeat,
            chicken: callGetIngredients.chicken,
            duck: callGetIngredients.duck,
            salmon: callGetIngredients.salmon,
            tuna: callGetIngredients.tuna,
            shrimp: callGetIngredients.shrimp,
            crab: callGetIngredients.crab,
            lobster: callGetIngredients.lobster,
            clam: callGetIngredients.clam,
            oyster: callGetIngredients.oyster,
            mussel: callGetIngredients.mussel,
            scallop: callGetIngredients.scallop,
            milk: callGetIngredients.milk,
            cheese: callGetIngredients.cheese,
            butter: callGetIngredients.butter,
            wheat: callGetIngredients.wheat,
            barley: callGetIngredients.barley,
            rice: callGetIngredients.rice,
            corn: callGetIngredients.corn,
            soybean: callGetIngredients.soybean,
            peanut: callGetIngredients.peanut,
            almond: callGetIngredients.almond,
            cashewNut: callGetIngredients.cashewNut
        })
    }
})

//PATCH ingredients
app.patch('/ingredients', async function (req, res) {
    const {session, pork, beef, horseMeat, chicken, duck, salmon, tuna, shrimp, crab, lobster, clam, oyster, mussel, scallop, milk, cheese, butter, wheat, barley, rice, corn, soybean, peanut, almond, cashewNut} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callPatchIngredients = await patchIngredients(session, pork, beef, horseMeat, chicken, duck, salmon, tuna, shrimp, crab, lobster, clam, oyster, mussel, scallop, milk, cheese, butter, wheat, barley, rice, corn, soybean, peanut, almond, cashewNut)

    if (callPatchIngredients.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPatchIngredients.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPatchIngredients.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//POST foodAI
app.post('/foodAI', upload.single('file'), async function (req, res) {
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).json({
            code: 1,
            message: 'file이 업로드되지 않았습니다.'
        });
    }

    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 2,
            message: 'session은 64자입니다.'
        })
    }

    const callPostFoodAI = await postFoodAI(session, uploadedFile.filename)

    if (callPostFoodAI.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPostFoodAI.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPostFoodAI.result === true) {
        return res.status(200).json({
            sidx: callPostFoodAI.sidx,
            imgURL: callPostFoodAI.imgURL,
            food: callPostFoodAI.name,
            description: callPostFoodAI.description,
            origin: callPostFoodAI.origin,
            howToEat: callPostFoodAI.howToEat,
            ingredients: callPostFoodAI.ingredients,
            cantIngredients: callPostFoodAI.cantIngredients
        })
    }
})

//POST googleMap
app.post('/googleMap', async function (req, res) {
    const {session, food, gpsX, gpsY} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!food || food.length > 100) {
        return res.status(400).json({
            code: 2,
            message: 'food는 1자 이상 100자 이하입니다.'
        })
    }

    if (typeof gpsX !== 'number' || !isFinite(gpsX) || gpsX < -180 || gpsX > 180) {
        return res.status(400).json({
            code: 3,
            message: 'gpsX는 -180 이상 180 이하의 숫자여야 합니다.'
        });
    }

    if (typeof gpsY !== 'number' || !isFinite(gpsY) || gpsY < -90 || gpsY > 90) {
        return res.status(400).json({
            code: 4,
            message: 'gpsY는 -90 이상 90 이하의 숫자여야 합니다.'
        });
    }


    const callPostGoogleMap = await postGoogleMap(session, food, gpsX, gpsY)

    if (callPostGoogleMap.code === 5) {
        return res.status(400).json({
            code: 5,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPostGoogleMap.code === 6) {
        return res.status(400).json({
            code: 6,
            message: '검색 결과가 없습니다.'
        })
    }

    if (callPostGoogleMap.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPostGoogleMap.result === true) {
        return res.status(200).json({
            googleMap: callPostGoogleMap.googleMap
        })
    }
})

//GET searchList
app.get('/searchList', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetSearchList = await getSearchList(session)

    if (callGetSearchList.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetSearchList.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetSearchList.result === true) {
        return res.status(200).json({
            searchList: callGetSearchList.searchList
        })
    }
})

//PATCH foodLike
app.patch('/foodLike', async function (req, res) {
    const {session, sidx, like} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!sidx || sidx > 999999999) {
        return res.status(400).json({
            code: 2,
            message: 'sidx는 999999999이하입니다.'
        })
    }

    if (like !== 0 && like !== 1) {
        return res.status(400).json({
            code: 3,
            message: 'like는 0혹은 1입니다.(0:비활성화 1:활성화)'
        })
    }

    const callPatchFoodLike = await patchFoodLike(session, sidx, like)

    if (callPatchFoodLike.code === 4) {
        return res.status(400).json({
            code: 4,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPatchFoodLike.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPatchFoodLike.result === true) {
        return res.status(200).json({
            message: '성공'
        })
    }
})

//GET foodLike
app.get('/foodLike', async function (req, res) {
    const {session, sidx} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!sidx || sidx > 999999999) {
        return res.status(400).json({
            code: 2,
            message: 'sidx는 999999999이하입니다.'
        })
    }

    const callGetFoodLike = await getFoodLike(session, sidx)

    if (callGetFoodLike.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetFoodLike.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetFoodLike.result === true) {
        return res.status(200).json({
            like: callGetFoodLike.like
        })
    }
})

//GET searchDetail
app.get('/searchDetail', async function (req, res) {
    const {session, sidx} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!sidx || sidx > 999999999) {
        return res.status(400).json({
            code: 2,
            message: 'sidx는 999999999이하입니다.'
        })
    }

    const callGetSearchDetail = await getSearchDetail(session, sidx)

    if (callGetSearchDetail.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetSearchDetail.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetSearchDetail.result === true) {
        return res.status(200).json({
            sidx: callGetSearchDetail.sidx,
            imgURL: callGetSearchDetail.imgURL,
            food: callGetSearchDetail.name,
            description: callGetSearchDetail.description,
            origin: callGetSearchDetail.origin,
            howToEat: callGetSearchDetail.howToEat,
            ingredients: callGetSearchDetail.ingredients,
            cantIngredients: callGetSearchDetail.cantIngredients
        })
    }
})

//GET likeRanking
app.get('/likeRanking', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetLikeRanking = await getLikeRanking(session)

    if (callGetLikeRanking.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetLikeRanking.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetLikeRanking.result === true) {
        return res.status(200).json({
            likeRanking: callGetLikeRanking.foods
        })
    }
})

//GET searchRanking
app.get('/searchRanking', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetSearchRanking = await getSearchRanking(session)

    if (callGetSearchRanking.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetSearchRanking.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetSearchRanking.result === true) {
        return res.status(200).json({
            likeRanking: callGetSearchRanking.foods
        })
    }
})

//POST ocrAI
app.post('/ocrAI', upload.single('file'), async function (req, res) {
    const uploadedFile = req.file;

    if (!uploadedFile) {
        return res.status(400).json({
            code: 1,
            message: 'file이 업로드되지 않았습니다.'
        });
    }

    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 2,
            message: 'session은 64자입니다.'
        })
    }

    const callPostOcrAI = await postOcrAI(session, uploadedFile.filename)

    if (callPostOcrAI.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPostOcrAI.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPostOcrAI.result === true) {
        return res.status(200).json({
            menu: callPostOcrAI.menu
        })
    }
})

//POST textAI
app.post('/textAI', async function (req, res) {
    const {session, food} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    if (!food || food.length > 100) {
        return res.status(400).json({
            code: 2,
            message: 'food는 1자 이상 100자 이하입니다.'
        })
    }

    const callPostTextAI = await postTextAI(session, food)

    if (callPostTextAI.code === 3) {
        return res.status(400).json({
            code: 3,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callPostTextAI.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callPostTextAI.result === true) {
        return res.status(200).json({
            sidx: callPostTextAI.sidx,
            imgURL: callPostTextAI.imgURL,
            food: callPostTextAI.name,
            description: callPostTextAI.description,
            origin: callPostTextAI.origin,
            howToEat: callPostTextAI.howToEat,
            ingredients: callPostTextAI.ingredients,
            cantIngredients: callPostTextAI.cantIngredients
        })
    }
})

//GET googleTranslate
app.get('/googleTranslate', async function (req, res) {
    const {session} = req.body

    if (!session || session.length !== 64) {
        return res.status(400).json({
            code: 1,
            message: 'session은 64자입니다.'
        })
    }

    const callGetGoogleTranslate = await getGoogleTranslate(session)

    if (callGetGoogleTranslate.code === 2) {
        return res.status(400).json({
            code: 2,
            message: 'session이 만료되었거나 일치하지 않습니다.'
        })
    }

    if (callGetGoogleTranslate.result === false) {
        return res.status(500).json({
            message: '서버 오류입니다.'
        })
    }

    if (callGetGoogleTranslate.result === true) {
        return res.status(200).json({
            googleTranslate: callGetGoogleTranslate.url
        })
    }
})

app.listen(config.port)