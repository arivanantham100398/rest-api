const router = require('express').Router()
const User = require("../models/User")
const CryptoJs = require("crypto-js")
const JWT = require("jsonwebtoken")

// REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString()
  })
  try {
    const savedUser = await newUser.save()
    const { password, ...userInfo } = savedUser._doc
    res.status(201).json(userInfo)
  } catch (error) {
    res.status(500).json(error)
  }
})

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    !user && res.status(401).json("Wrong Credentials")

    const hashedPassword = CryptoJs.AES.decrypt(user.password, process.env.PASSWORD_SEC)
    const decryptedPass = hashedPassword.toString(CryptoJs.enc.Utf8)

    decryptedPass !== req.body.password && res.status(401).json("Wrong Credentials")

    const accessToken = JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SEC,
      { expiresIn: "7d" }
    )
    const { password, ...userInfo } = user._doc
    res.status(200).json({ ...userInfo, accessToken })
  } catch (error) {
    res.status(500).json(error)
  }
})


module.exports = router