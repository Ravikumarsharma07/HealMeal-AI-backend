import app from "./app.js";
import authenticateToken from "./middlewares/authMiddleware.js";

const port = process.env.PORT || 5000;

app.post("/api/authenticateAdmin", (req , res)=>{
  authenticateToken(req, res)
})


app.listen(port, () => {
  console.log("Server is running on port 5000");
});  