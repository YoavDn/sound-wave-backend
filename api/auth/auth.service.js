const Cryptr = require('cryptr')

const bcrypt = require('bcrypt')
const userService = require('../user/user.service')
const logger = require('../../services/logger.service')

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

async function login(username, password, email) {
    logger.debug(`auth.service - login with username: ${username}`)
    const user = await userService.getByUsername(username, email)
    console.log(user);
    // if (!user) return Promise.reject('Invalid username or password')
    if (!user) throw new Error('Invalid username or password')
    // TODO: un-comment for real login
    // const match = await bcrypt.compare(password, user.password)
    // if (!match) throw new Error('Invalid username or password')

    delete user.password
    return user
}

async function signup(username, password, fullname, email) {
    const saltRounds = 10
    console.log(username, password, fullname, email);
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`)
    if (!username || !password || !fullname || !email) return Promise.reject('fullname, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({ username, password: hash, fullname, email })
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}





module.exports = {
    signup,
    login,
    getLoginToken,
    validateToken
}