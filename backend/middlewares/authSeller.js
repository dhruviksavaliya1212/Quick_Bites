import jwt from 'jsonwebtoken';

const authSeller = async(req,res, next) => {
  try {
    const {token} = req.headers;

    if(!token){
      return res.json({success:false, message:"Unauthorized! Please login."})
    }

    const token_decode = jwt.verify(token, process.env.JWT_SECRET);

    // console.log(token_decode);

    req.body.sellerId = token_decode.id;

    next();

  } catch (err) {
    console.log(err)
    res.json({success:false, message:"Something went wrong"})
  }
}

export default authSeller;