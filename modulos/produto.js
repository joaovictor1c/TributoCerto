var express = require('express')
var router = express.Router()
var dateFormat = require('dateformat')
const { verifyJWT } = require('../verifyJWT')
const { Pool } = require('pg')
const { conn } = require('../db')
const { Sequelize } = require('sequelize');

var knex = require('knex')({
  client: 'postgres',
  connection: {
    host : 'localhost',
    user : 'postgres',
    password : '740516',
    database : 'DBProduto',
    port:8080
  }
});

router.get('/', verifyJWT, (req,res)=>{
  
  const {codigo,descricao} = req.body
  knex
  .select(
    'a.descricao',
    'a.data_inclusao',
    'a.usuario',
    'b.cest',
    'b.ncm',
    'b.data_inclusao',
    'b.data_auditoria',
    'b.data_validade',
    'b.usuario',
    'b.ativo',
    'c.cst_icms',
    'c.aliquota_icms',
    'c.csosn_icms',
    'c.uf',
    'c.data_inclusao',
    'c.data_auditoria',
    'c.data_validade',
    'c.usuario',
    'c.ativo',
    'd.cst_ipi',
    'd.cst_cofins',
    'd.aliquota_ipi',
    'd.cst_pis',
    'd.aliquota_pis',
    'd.aliquota_cofins',
    'd.data_inclusao',
    'd.data_auditoria',
    'd.data_validade',
    'd.usuario')
  .from('p_basico as a')
  .leftJoin('p_complemento as b','b.id_produto', 'a.id')
  .leftJoin('p_estadual as c','c.id_produto', 'a.id')
  .leftJoin('p_federal as d','d.id_produto', 'a.id')
  .where('descricao', 'like', `%${descricao}%`)
  .limit(10)
  .then(con=>{
    res.status(200).send({ auth: true, result: true, dados: con })
  })
  .catch(err=>{
    res.status(500).send({ auth: true, result: false, erro: err.message })  
  })
})

// router.get('/', verifyJWT, (req, res) => {
//     const {usuario, cnpj}  = req.user
//     var p = true
//     const pool  = new Pool (conn())    
//     var qry= `select a.codigo, 
//     a.descricao,
//     a.data_inclusao,
//     a.usuario, 
//     b.ncm, 
//     b.cest,
//     b.data_inclusao,
//     b.data_auditoria,
//     b.data_validade,
//     b.usuario,
//     b.ativo,
//     c.cst_icms,
//     c.aliquota_icms,
//     c.csosn_icms,
//     c.uf,
//     c.data_inclusao,
//     c.data_auditoria,
//     c.data_validade,
//     c.usuario,
//     c.ativo,
//     d.cst_ipi,
//     d.cst_cofins,
//     d.aliquota_ipi,
//     d.cst_pis,
//     d.aliquota_pis,
//     d.aliquota_cofins,
//     d.data_inclusao,
//     d.data_auditoria,
//     d.data_validade,
//     d.usuario
//     from p_basico a,
//     left join p_complemento b on a.id = b.id_produto 
//     left join p_estadual c on a.id = c.id_produto 
//     left join p_federal d on a.id = d.id_produto
//     `
//     if (req.body.codigo) {
//       qry+= ` and codigo like '%${req.body.codigo}%'`
//       p=false
//     }
//     if (req.body.descricao) {
//       if (p){
//         qry+= ` and descricao like '%${req.body.descricao}%'` 
//       } else {
//         qry+= ` and descricao like '%${req.body.descricao}%'` 
//       }         
//       p=false  
//     }
//     console.log(qry)
//     pool
//     .query(qry)
//     .then(con => {    
//       const dados=con.rows      
//       res.status(200).send({ auth: true, result: true, dados })
//     })
//     .catch(err => {
//       const e = err.message
//       res.status(500).send({ auth: true, result: false, erro: e })      
//     })  
// })
  

module.exports = router