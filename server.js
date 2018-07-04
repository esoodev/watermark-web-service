const bodyParser = require("body-parser")

/**
 * Express : regular routes
 */
const express = require("express")
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
const port = 8000

require("./app/routes")(app)

app.use("/", express.static("app/public"))
app.use("/files", express.static("app/files"))

app.listen(port, () => {
  console.log("We are live on " + port)
})