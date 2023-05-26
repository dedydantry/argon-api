const bcrypt = require('bcrypt')
const saltRound = 10
const jwt = require('jsonwebtoken')
require('dotenv').config()
const APPKEY = process.env.APP_KEY
const expired = 2628000 // 1 month

const PasswordHas = {

    Hash(plainText){
        return new Promise(resolve => {
            bcrypt.hash(plainText, saltRound)
            .then(res => resolve(res))
        })
    },

    Check(passwordHash, plainText){
        return new Promise(resolve => {
            bcrypt.compare(plainText, passwordHash)
            .then(res => resolve(res))
        })
    }

}

const errorValidations = (obj) => {
    let errors = []
    Object.keys(obj).forEach(function(key) {
        errors.push(obj[key]['message'])
    });
    return errors
}


const jwtSign = (params) =>{
    return jwt.sign(params, APPKEY, { expiresIn: expired })
}

const jwtVerify = (token) => {
    try {
        const check = jwt.verify(token, APPKEY)
        return check
    } catch (error) {
        return null
    }
}

const fileHost = (file) => {
    return `${process.env.APP_HOST}:${process.env.APP_PORT}/${file}`
}

module.exports = {
    PasswordHas,
    errorValidations,
    jwtSign,
    jwtVerify,
    fileHost
}