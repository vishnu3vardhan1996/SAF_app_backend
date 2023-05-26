require("dotenv").config();
const jwt = require("jsonwebtoken");
// const {token} = require('./server');

module.exports = (req, res, next) => {
  try {
    // const duplicateToken = req.headers.authorization.split(" ")[1];

    // const duplicateToken = req.headers.authorization;

    console.log(token);

    // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDZlNTFlNjA5ZWE4YThiM2ZlNGRmNWUiLCJ1c2VyRW1haWwiOiJ2Y2hlbGxhbSIsImlhdCI6MTY4NTA0MjgxNiwiZXhwIjoxNjg1MTI5MjE2fQ.Y0D3bpFAs4qRS55Se-eNeGaLJe1Gf69YxfsgYBz4esk"

    //check if the token matches the supposed origin
    const decodedToken = jwt.verify(token, "RANDOM-TOKEN"); 

    console.log(decodedToken);

    // retrieve the user details of the logged in user
    const user = decodedToken;

    // pass the user down to the endpoints here
    req.user = user;

    // pass down functionality to the endpoint
    next();

  }

  catch (error) {
    console.log(error);
    res.status(401).json({
      error: new Error("Invalid request!"),
      // error: error,
    });
  }
};