const dayjs = require('dayjs')
const {Attendances, User} = require('../models/index');
const { Op } = require('sequelize');

const AttendanceController = {

    async index(req, res){
        try {
            const user = req.auth
            let beginDate = req.query.begin_date
            let endDate = req.query.end_date
            let employee = req.query.employee

            if(!beginDate){
                beginDate = `${dayjs().format('YYYY-MM')}-01`
            }

            if(!endDate){
                endDate = `${dayjs().format('YYYY-MM-DD')}`
            }
            let where = {
                periode:{
                    [Op.between] : [beginDate, endDate]
                }
            }
            if(!user.is_admin){
                where = {
                    ...where,
                    user_id:user.id
                }
            }else{
                if(employee){
                    where = {
                        ...where,
                        user_id:employee
                    }
                }
            }

            
            const attendance = await Attendances.findAll({
                where,
                order:[['id', 'DESC']],
                include:[
                    {
                        as:'user',
                        model:User
                    }
                ]
            })
            return res.send({
                status:true,
                data:attendance
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    },

    async store(req, res){

        try {
            const now = dayjs()
            // get atendance by date today
            const check = await Attendances.findOne({
                where:{
                    periode: now.format('YYYY-MM-DD'),
                    user_id:req.auth.id
                }
            })

            
            if(check){
                await Attendances.update({
                    clock_out:now.format('YYYY-MM-DD HH:mm:ss')
                }, {
                    where:{
                        id:check.id
                    }
                })
            }else{
                const params = {
                    user_id:req.auth.id,
                    periode: now.format('YYYY-MM-DD'),
                    clock_in: now.format('YYYY-MM-DD HH:mm:ss')
                }
                await Attendances.create(params)
            }

            return res.send({
                status:true,
                data:'Has filled'
            })

        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }

    },

    async current(req, res){
        try {
            const user = req.auth
            const now = dayjs()
            
            const attendance =  await Attendances.findOne({
                where:{
                    periode: now.format('YYYY-MM-DD'),
                    user_id:req.auth.id
                }
            })
            return res.send({
                status:true,
                data:attendance
            })
        } catch (error) {
            return res.send({
                status:false,
                data:error.message
            })
        }
    }

}

module.exports = AttendanceController