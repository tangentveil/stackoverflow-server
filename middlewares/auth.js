import jwt from "jsonwebtoken";

// next (callback function) ---> is there any token or not
// all the controllers .js file only run when 'next' invoke
const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    let decodeData = jwt.verify(token, "test");
    req.userId = decodeData?.id;

    next();
  } catch (error) {
    console.log(error)
  }
};

export default auth;
