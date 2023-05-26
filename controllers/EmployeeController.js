const {User} = require('../models/index')
const {fileHost} = require('../helpers/index')
const { errorValidations,PasswordHas } = require('../helpers/index')
const {Validator} = require('node-input-validator')

const EmployeeController = {
    
    async index(req, res){
        try {
            const users = await User.findAll({
                order:[['name', 'ASC']]
            })
            return res.send({
                status:true,
                data:users
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async store(req, res) {
        try {
            const validate = new Validator(req.body, {
                name:'required',
                email:'required|email',
                title:'required',
                phone:'required',
            })
            const matched = await validate.check()
            if(!matched) return res.send({
                status:false,
                data:errorValidations(validate.errors)
            })

            const {name,email,phone,title} = req.body
            const add = await User.create({
                name,
                email,
                phone,
                title,
                photo:'https://demos.pixinvent.com/vuexy-vuejs-admin-template/demo-1/assets/avatar-1-129659bb.png'
            })
            return res.send({
                status:true,
                data:add
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async update(req, res){
        try {
            const validate = new Validator(req.body, {
                phone:'required',
            })
            const matched = await validate.check()
            if(!matched) return res.send({
                status:false,
                data:errorValidations(validate.errors)
            })

            const params = {
                phone:req.body.phone,
            }
            if(req.file){
                const fileName = fileHost(req.file.filename)
                params.photo = fileName
            }
            await User.update(params, {
                where:{
                    id:req.auth.id
                }
            })

            const message = `${req.auth.name} has updated profile`
            req.io.emit('notification', message)

            return res.send({
                status:true,
                data:'has updated'
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async changePassword(req, res){
        try {
            const validate = new Validator(req.body, {
                password:'required',
                new_password:'required',
            })

            const matched = await validate.check()
            if(!matched) return res.send({
                status:false,
                data:errorValidations(validate.errors)
            })

            const user = await User.findOne({
                where:{
                    id:req.auth.id
                }
            })
            
            const passwordConfirmed = await PasswordHas.Check(user.password, req.body.password)
            if(!passwordConfirmed) return res.send({
                status:false,
                message:'Invalid password'
            })

            const newPassword = await PasswordHas.Hash(req.body.new_password)

            await User.update({
                password:newPassword
            }, {
                where:{
                    id:req.auth.id
                }
            })

            const message = `${req.auth.name} has changed password`
            req.io.emit('notification', message)

            return res.send({
                status:true,
                data:'Has changed'
            })
            
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async destroy(req, res){
        try {
            const id = req.params.id
            await User.destroy({
                where:{
                    id
                }
            })
            return res.send({
                status:true,
                data:'Has Deleted'
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    }
}

module.exports = EmployeeController