const Router = require('express').Router();

Router.get('/', (req, res)=>{
    res.send('index');
})

module.exports = Router