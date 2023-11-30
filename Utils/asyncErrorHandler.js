module.exports = (apiFunc) => {
    return (req,res,next)=>{
         apiFunc(req,res,next).catch(err=>next(err))
     }
}
