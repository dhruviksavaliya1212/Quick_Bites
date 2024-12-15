import jwt from 'jsonwebtoken';

const authUser = async(req,res,next) => {

  try {
    const {token} = req.headers;

    if(!token){
      return res.json({success:false, message:"Unathorized user. Login again"})
    }

    const token_decode = jwt.verify(token,process.env.JWT_SECRET)

    req.body.userId = token_decode.id

    next();
  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
  }
}

export default authUser