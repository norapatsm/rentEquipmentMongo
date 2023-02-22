const express = require('express');
const getUsers = require('../controller/user_controller.js');
const router = express.Router()


// a variable to save a session
var session;

//หน้าที่ check ว่า ต้อง มีการ auth ป่าว หรือว่าไม่ต้อง auth ละ
router.get('/', (req, res) => { 
    session = req.session;
    if (session.userid) {
        res.redirect('/dashboard');
    } else
    res.render('login.ejs'); // the most beutiful login ever (may be) 
});

//login api ไม่สามารถ get ปกติได้
router.post('/login', async (req, res, next )=>{ 
    //console.log("in the session :",req.session);
    //if (req.body.username == myusername && req.body.password == mypassword) { // ไว้เเเบบ ไม่มี database
    let id = await getUsers({username:req.body.username, password:req.body.password});
    //console.log(id);
    if(id) {
        /**login pass */
        session=req.session;
        session.userid = id;
        console.log(session,"has loged in\n");
        res.redirect('/dashboard');
    }
    else{
        res.render('login.ejs');
    } 
})

router.get('/dashboard',(req,res,next)=>{
    session = req.session;
    if(session.id){
        /** has log in yet */
        next();/** ทำให้กระโดดไปตัต่อไป */
    }else{
        /**ถ้าไม่มี session ฝังใน browser */
        res.redirect('/');
    }
},
/**เมื่อ login ไปเเล้ว ก็เข้ามาที่นี้เลย */
(req,res,next)=>{
res.send('this is dash board <hr> <a href="/logout">click me to logout</a> ');
});

router.get((req,res,next)=>{
    
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
