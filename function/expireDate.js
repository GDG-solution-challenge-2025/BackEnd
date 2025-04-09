export async function expireDate(hours) {
    try {
        const date = new Date()
        date.setHours(date.getHours() + hours)
        const expire = date.toISOString().slice(0, 19).replace('T', ' ')

        return {
            result: true,
            date: expire
        }
    }

    catch (err) {
        return {
            result: false
        }
    }
}