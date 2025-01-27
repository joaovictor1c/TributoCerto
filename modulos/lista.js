var express = require('express')
var router = express.Router()
var dateFormat = require('dateformat')
const { verifyJWT } = require('../verifyJWT')
const { Pool } = require('pg')
const { conn } = require('../db')


router.get('/', verifyJWT, (req, res) => {
    const {cpf}  = req.user
    const pool  = new Pool (conn())    
    var qry = `select * from cliproduto where cliente='${cpf}'`
    pool
    .query(qry)
    .then(con => {    
      const dados=con.rows
      res.status(200).send({ auth: true, result: true, dados })
    })
    .catch(err => {
      const e = err.message
      res.status(500).send({ auth: true, result: false, erro: e })      
    })  
})
  
  
router.post('/', verifyJWT, (req, res) => {  
    const {cpf} = req.user
    const pool  = new Pool(conn())     
    let dados = req.body
    
    qryText = `insert into cliproduto(
      cliente,
      codproduto
      ) values (
      '${cpf}'
      ,'${dados.cod_produto}'
      )`;
    pool
    .query(qryText)
    .then(() => {
      res.status(200).send({ auth: true, result: true })      
    })
    .catch(err => {
      const e = err.message
      res.status(500).send({ auth: true, result: false, erro: e })
  })           
})


router.delete('/:codproduto', verifyJWT, (req, res) => {    
    const {cpf}  = req.user
    const pool  = new Pool (conn())
    var qryText
    if (req.params.codproduto === 'todos'){
        qryText = `delete from cliproduto where cliente='${cpf}'`
    } else {
        qryText = `delete from cliproduto where cliente='${cpf}' and codproduto='${req.params.codproduto}'`
    }    
    pool
      .query(qryText)
      .then(() => {
        res.status(200).send({ auth: true, result: true })
      })  
      .catch((err) => { 
        const e = err.message
        res.status(500).send({ auth: true, result: false, erro: e })
      })
})


module.exports = router