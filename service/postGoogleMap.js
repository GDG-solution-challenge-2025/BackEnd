//node module
import axios from 'axios'

//config
import config from '../config.js'

//function
import {checkExpireSession} from '../function/checkExpireSession.js'
import {findUser} from '../repository/findUser.js'

export async function postGoogleMap(session, food, gpsX, gpsY) {
    try {
        const callCheckExpireSession = await checkExpireSession(session)

        if (callCheckExpireSession.result === false) {
            throw new Error()
        }

        if (callCheckExpireSession.expire === true) {
            return {
                result: true,
                code: 5
            }
        }

        const GOOGLE_API_KEY = config.gcpKey
        const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
        const callFindUser = await findUser(callCheckExpireSession.uidx)

        if (callFindUser.result === false) {
            throw new Error()
        }

        var lang = 'ko'

        if (callFindUser.lang === 0) {
            lang = 'ko'
        }

        if (callFindUser.lang === 1) {
            lang = 'en'
        }

        const params = {
            location: `${gpsY},${gpsX}`,
            radius: 1000,
            keyword: food,
            type: 'restaurant',
            language: lang,
            key: GOOGLE_API_KEY
        }


        const response = await axios.get(url, { params })

        if (response.data.status !== 'OK' || !response.data.results) {
            return {
                result: true,
                code: 6,
            }
        }

        const places = response.data.results.map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating || 'No rating',
            photo_reference: place.photos ? place.photos[0].photo_reference : null,
            place_id: place.place_id
        }));

        const googleMap = places.map(place => ({
            name: place.name,
            address: place.address,
            rating: place.rating,
            imgURL: place.photo_reference
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=${GOOGLE_API_KEY}`
                : null,
            mapURL: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
        }));

        return {
            result: true,
            googleMap: googleMap
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}