const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post");
const categoryRoute = require("./routes/categories");

const app = express()
dotenv.config()

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("DB Connected Successfully"))
    .catch((err) => console.log(err))

app.listen(process.env.PORT || 5000, () => {
    console.log("API is running on", process.env.PORT);
})
app.use(express.json())
app.use(cors())

app.use("/api/auth",authRoute)
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.get('/', (req, res) => {
    res.send('API is running')
  })