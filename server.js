const express = require("express");
const fs = require("fs");
const hbs = require("hbs");
const app = express();
app.set("view engine", "hbs")
const port = process.env.PORT || 3000

hbs.registerPartials(__dirname + "/views/partials")
hbs.registerHelper("getCurrentYear", () => {
	return new Date().getFullYear()
})

// creating our own middleware, the final method call needs to be next()
// otherwise, our app will hang as the middleware sits waiting
app.use((req, res, next) => {
	let now = new Date().toString();
	let data = `${now}: ${req.method} ${req.url}`
	console.log(data);
	fs.appendFile("server.log", data, (error)=> {
		if (error) {
			console.log("unable to write to log")
		}
	})
	next();
})

// create our own middleware which prevents any page from being seen
// except for our maintenance page
// app.use((req, res, next)=> {
// 	res.render("maintenance.hbs")
// })

// use a static directory middlewar. Don't need to explicitly declare
// routes.  Url gets mapped to the public dir and a filename matching the 
// the relative path is searched for.
app.use(express.static(__dirname + "/public"))

app.get("/", (req, res) => {
	res.render("home.hbs", {
		pageTitle: "Home",
		welcomeMsg: "Learning Node and Express!"
	})
})

app.get("/about", (req, res) => {
	res.render("about.hbs", {
		pageTitle: "About"
	})
})

app.get("/bad", (req,res) => {
	res.send({
		errorMessage: "This page does not exist"
	})
})

app.listen(port, () => {
	console.log(`Server up and running on port ${port}`)
})