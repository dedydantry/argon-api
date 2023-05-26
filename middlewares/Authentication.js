const {jwtVerify} = require('../helpers/index')

const Authentication = {

    async auth(req, res, next){
        const token = req.headers['authorization']
        if(typeof token == 'undefined') return res.send({
            status:false,
            message:'Unauthorized'
        })
        const verify = jwtVerify(token.replace('Bearer ', ''))
        if(!verify) return res.send({
            status:false,
            message:'Unauthorized'
        })
        req.auth = verify
        return next()
    }

}

module.exports = Authentication