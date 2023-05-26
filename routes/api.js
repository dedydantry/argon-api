const express = require("express")
const multer = require('multer')
const api = express();
const Authentication = require('../middlewares/Authentication')
const storage = require('../middlewares/storage')
const upload = multer({ storage: storage })

const AuthController = require("../controllers/AuthController");
const AttendanceController = require("../controllers/AttendanceController");
const EmployeeController = require("../controllers/EmployeeController");

api.post('/signin', AuthController.signin)
api.get('/me', Authentication.auth, AuthController.me)

api.get('/user', Authentication.auth, EmployeeController.index)
api.post('/user', Authentication.auth, EmployeeController.store)
api.put('/user', Authentication.auth, upload.single('image'), EmployeeController.update)
api.patch('/user', Authentication.auth, EmployeeController.changePassword)
api.delete('/user/:id', Authentication.auth, EmployeeController.destroy)

api.get('/attendance', Authentication.auth, AttendanceController.index)
api.post('/attendance', Authentication.auth, AttendanceController.store)
api.get('/attendance/current', Authentication.auth, AttendanceController.current)

module.exports = api