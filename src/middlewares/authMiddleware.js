import jwt from "jsonwebtoken"


export const authMiddleware = (req, res, next) => {
  const { token } = req.cookies;  
  if (!token) { 
    return res.status(401).json({ message: "Unauthorised admin", success:false, redirectURL:"/login" });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid token or token expired", success:false, redirectURL:"/login" });
  }
}


const authenticateToken = (req,res) => { 
    if(!req.cookies) return res.json({message:"Token not found", redirectURL:"/login"})

    const {token} = req.cookies;
    if(!token){
        return res.json({message:"Unauthorised admin", redirectURL:"/login"})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if(!decoded) return res.json({message:"Invalid token or token expired", redirectURL:"/login"})
        const {role,email, hospitalID} = decoded

        if(role == "manager"){
            return res.status(200).json({ message: 'authorised admin', redirectURL: '/Dashboard/manager', email, hospitalID })
        }else if(role == "pantry"){
            return res.status(200).json({ message: 'authorised admin', redirectURL: '/Dashboard/pantry', email, hospitalID })
        } else if (role == "delivery") {
            return res.status(200).json({ message: 'authorised admin', redirectURL: '/Dashboard/delivery', email, hospitalID })
        }
    } catch (error) {
        console.log(error)
        res.status(401).json({message:"Invalid token or token expired", redirectURL:"/login"})        
    }
}

export default authenticateToken