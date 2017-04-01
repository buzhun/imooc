module.exports = function(options){
  return function(req,res,next){
    req.option1 = options.option1
    next()
  }
}
