const router = require('express').Router()
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const JWT = require("jsonwebtoken")

// REGISTER
router.post("/register", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ success: false, message: "Fill all the important fields" })
  }
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString()
  })
  try {
    const user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(401).json({ success: false, message: 'Email already exists' });
    }
    const savedUser = await newUser.save()
    const { password,updatedAt,__v, ...userInfo } = savedUser._doc
    res.status(201).json({ success: true, message: "Account Registered Successfully", userInfo })
  } catch (error) {
    res.status(500).json(error)
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ success: false, message: 'User Not Found' });
    }
    const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASSWORD_SEC)
    const decryptedPass = hashedPassword.toString(CryptoJs.enc.Utf8)
    if (decryptedPass !== req.body.password) {
      return res.status(401).json({ success: false, message: 'Wrong Password' });
    }
    const accessToken = JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    )
    const { password, createdAt, updatedAt, __v, ...userInfo } = user._doc
    res.status(200).json({ success: true, ...userInfo, accessToken })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error Occured' });
  }
})


module.exports = router