const conn = function(){
    return {
    user: 'postgres',
    password: '740516',
    host: 'localhost',
    database: `DBProduto`,    
    port: 8080}
}

module.exports.conn = conn