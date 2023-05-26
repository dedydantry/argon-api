const {Validator} = require('node-input-validator')
const { errorValidations,PasswordHas,jwtSign } = require('../helpers/index')
const {User} = require('../models/index')
const AuthController = {

    async signin(req, res){
        try {
            const validate = new Validator(req.body, {
                email:'required|email',
                password:'required',
            })

            const matched = await validate.check()
            if(!matched) return res.send({
                status:false,
                message:errorValidations(validate.errors)
            })

            const user = await User.findOne({
                where:{email:req.body.email},
            })

            if(!user) return res.send({
                status:false,
                message:'Invalid email'
            })

            const passwordConfirmed = await PasswordHas.Check(user.password, req.body.password)
            if(!passwordConfirmed) return res.send({
                status:false,
                message:'Invalid password'
            })

            const paramsJwt = {
                id:user.id,
                name:user.name,
                email:user.email,
                is_admin:user.is_admin
            }

            const token = jwtSign(paramsJwt)
            return res.send({
                token:`${token}`
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async me(req, res){
        try {
            const user = await User.findOne({
                where:{
                    id:req.auth.id
                }
            })
            return res.send({
                status:true,
                data:user
            })

        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    }
}

module.exports = AuthController