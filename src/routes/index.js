// Agregador geral de rotas
module.exports = (app) =>{
  // Rotas WEB
  app.use('/', require('./web'));

  // Rotas API
  app.use('/api', require('./api'));
};
