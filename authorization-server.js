const fs = require("fs")
const express = require("express")
const bodyParser = require("body-parser")
const jwt = require("jsonwebtoken")
const {
	randomString,
	containsAll,
	decodeAuthCredentials,
	timeout, randomString,
} = require("./utils")

const config = {
	port: 9001,
	privateKey: fs.readFileSync("assets/private_key.pem"),

	clientId: "my-client",
	clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
	redirectUri: "http://localhost:9000/callback",

	authorizationEndpoint: "http://localhost:9001/authorize",
}

const clients = {
	"my-client": {
		name: "Sample Client",
		clientSecret: "zETqHgl0d7ThysUqPnaFuLOmG1E=",
		scopes: ["permission:name", "permission:date_of_birth"],
	},
	"test-client": {
		name: "Test Client",
		clientSecret: "TestSecret",
		scopes: ["permission:name"],
	},
}

const users = {
	user1: "password1",
	john: "appleseed",
}

const requests = {}
const authorizationCodes = {}

let state = ""

const app = express()
app.set("view engine", "ejs")
app.set("views", "assets/authorization-server")
app.use(timeout)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/*
Your code here
*/
app.get('/authorise', function (request,response){
	let client_id = request.query.client_Id;
	if(!Object.keys(clients).includes(client_id))
	{
		response.status(400);
	}
	else
	{
		let client = clients[client_id];
		if(request.query.scopes.every((scope) => client.scopes.includes(scope)))
		{
			response.status(200);
			let randomString = randomString();
			requests[randomString] = request;
			response.render("login", client, request.query.scope, randomString)
		}
	}
	response.end()
})

app.post('/login', function (request, response, body){
	let user = body.userName;
	if(!(Object.keys(users).includes(user)) || !users[user] !== body.password || !requests[body.requestId])
	{
		response.status(401)
	}

})

const server = app.listen(config.port, "localhost", function () {
	var host = server.address().address
	var port = server.address().port
})

// for testing purposes

module.exports = { app, requests, authorizationCodes, server }
