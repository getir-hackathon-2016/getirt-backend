/**
*Building server
*/
var express=require("express"),
app=express(),
crypto=require("crypto"),
bodyParser=require("body-parser");

var constants=require("./constants");
var tools=require("./methods/tools.js");

app.listen(8000,function(){
	console.log("server is running");
});
app.use(bodyParser.json());

var userMethods=require("./methods/userMethods.js");
var listingMethods=require("./methods/listingMethods.js");

app.post("/register", userMethods.register);
app.post("/login",userMethods.login);
		
app.get("/categories",listingMethods.categories);
app.get("/productsofcategory/:catNo/:start/:howmany", listingMethods.productsOfCategory);

/*
var messengerMethods=require("./methods/messengerMethods.js");
var orderMethods=require("./methods/orderMethods.js");
*/
	
/*	
app.post("/updateProducts", orderMethods.updateProducts);
app.get("/products", orderMethods.products);
app.get("/numberOfProducts", orderMethods.numberOfProducts);
app.get("/cost", orderMethods.cost);
app.get("/buy", orderMethods.buy);
		
app.get("/ordersHeCanTake", messengerMethods.ordersHeCanTake);
*/