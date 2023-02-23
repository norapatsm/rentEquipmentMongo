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
    let user = (await getUsers({username:req.body.username, password:req.body.password}))[0];
    console.log(user);
    if (user!==undefined){
        /**loginpass */
        session = req.session
        session.userid = user.id
        console.log(session.userid,'login pass');
        res.redirect('/dashboard');
    }else{
        /**login not pass */
        res.redirect('/');
    }
})

router.get('/dashboard',(req,res,next)=>{
    session = req.session;
    if(session.userid){
        /** has log in yet */
        next()
    }else{
       /**not login yet */
       res.redirect('/');
    }
},
/**เมื่อ login ไปเเล้ว ก็เข้ามาที่นี้เลย */
(req,res,next)=>{
    session=req.session;
    console.log(session.id,"went to dash board");
    res.send('this is dash board <hr> <a href="/logout">click me to logout</a> ');
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

router.get('/admin',(req,res)=>{ /**for render login page */
    res.render('adminLogin.ejs');
});

router.post('/admin/login',  /**for recive data from login form */
async (req,res)=>{
    let id = await getaAdminId(req.body.username, req.body.password);
    if(id===""){
        /** log in fail */
        res.redirect('/admin');
    }else{
        /**login passed */
        session = req.session;
        session.adminid = id;
        console.log('admin',session.adminid,'loged in');
        res.redirect('/adminboard');
    }});

router.get('/adminboard',(req,res,next)=>{
    session = req.session
    if(session.adminid){
        /**has loged in yet */
        next()
    }else{
        /**not has login before */
        res.redirect('/admin');
    }
},async (req,res)=>{
    let users = await getUsers({});
    let events = await getEvents({});
    res.render('adminboard.ejs',{data:{
        users: users,
        events:events
    }});
});

router.get('/user/:id',(req,res,next)=>{
    session = req.session
    if(session.adminid){
        /**has login yet */
        next();
    }else{
        /**has not login yet must go to login*/
        res.redirect('/admin');
    }
},(req,res)=>{
    let id = req.params.id;
    console.log('admin editing',id);
    res.render('edituser.ejs',{data:{

    }});
});

module.exports = router;
