const r=require('express').Router(),c=require('../controllers/dashboardController'),{protect}=require('../middleware/auth');r.get('/',protect,c.get);module.exports=r;
