module.exports = (app) => {
  
  app.get('/notes', (req, res, next) => {
    res.send('ok');
  });;

};
