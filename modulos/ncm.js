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

function verifyData(req, res ,next){s


}

router.get('/', verifyJWT, (req,res)=>{
	knex
	.select()
	.from('ncm')
	.limit(1000)
	.then(con=>{
		const dataAtual = new Date()
		con.map(e => {
			if(e.data < dataAtual){
				e.ativo = "S"
			}
		})
		res.status(200).send({ auth: true, result: true, dados: con })
		console.log(con)
    // res.status(200).send({ auth: true, result: true, dados: con })
  })
  .catch(err=>{
    res.status(500).send({ auth: true, result: false, erro: err.message })  
  })
})


router.get('/:ncm', verifyJWT, (req,res)=>{
	const {ncm} = req.params

	knex
	.select()
	.from('ncm')
	.where('ncm', '=', ncm)
	.then(con=>{
    res.status(200).send({ auth: true, result: true, dados: con })
  })
  .catch(err=>{
    res.status(500).send({ auth: true, result: false, erro: err.message })  
  })
})


router.post('/', verifyJWT, (req,res)=>{
	const {ncm,produto} = req.params
	
	const {descricao, tec, bkbit, excecoes, icms_in, icms_out, cfop_in,
		 cfop_out, st, nat_receita, cstpc, cstpc_entrada, percpiscred, 
		 percpisdeb, perccofinscred, perccofinsdeb, ativo,val_ibpt, 
		 nat_receitasec, cest, desc_cest, data, st_out, fundo_cp, icms_sub, seq} = req.body

	knex('ncm').insert([ncm, produto, descricao, tec, bkbit, excecoes, icms_in, icms_out, cfop_in, cfop_out,
		st, nat_receita, cstpc, cstpc_entrada, percpiscred, percpisdeb,perccofinscred, perccofinsdeb, 
		ativo, val_ibpt, nat_receitasec, cest, desc_cest, data, st_out, fundo_cp, icms_sub, seq])
	
  .then(con=>{
    res.status(200).send({ auth: true, result: true, dados: req.body })
  })
  .catch(err=>{
    res.status(500).send({ auth: true, result: false, erro: err.message })  
  })
})


router.put('/:ncm', verifyJWT, (req, res) => {
	const {ncm} = req.params

	const {descricao, tec, bkbit, excecoes, icms_in, icms_out, cfop_in, cfop_out, st, 
		nat_receita, cstpc, cstpc_entrada, percpiscred, percpisdeb,perccofinscred, 
		perccofinsdeb, ativo,val_ibpt, nat_receitasec, cest, desc_cest,data, st_out,
		fundo_cp, icms_sub, seq} = req.body

	knex('ncm')
	.where('ncm', ncm)
	.update({
		descricao, tec, bkbit, excecoes, icms_in, icms_out, cfop_in,
		cfop_out, st, nat_receita, cstpc, cstpc_entrada, percpiscred, 
		percpisdeb, perccofinscred, perccofinsdeb, ativo, val_ibpt,
		nat_receitasec, cest, desc_cest, data, st_out, fundo_cp, icms_sub, seq
	})
	.then(() => {  
		knex.select()
		.from('ncm')
		.then(cons =>{
			const dados=cons.rows
			res.status(200).send({ auth: true, result: true, dados })
		})  
	})
	.catch(err => {
		const e = err.message
		res.status(500).send({ auth: true, result: false, erro: e })      
	})  
})
  
module.exports = router