/**
*Building server
*/
var express=require("express"),
bodyParser=require("body-parser");

var app = express();
app.listen(8000,function(){
	console.log("server is running");
});

app.use(bodyParser.json());

var constants=require("./constants");
var tools=require("./methods/tools.js");

var userMethods=require("./methods/userMethods.js");
var listingMethods=require("./methods/listingMethods.js");
var orderMethods=require("./methods/orderMethods.js");

app.post("/register", userMethods.register);
app.post("/login",userMethods.login);
		
app.get("/categories",listingMethods.categories);
app.get("/productsofcategory/:catNo/:start/:howmany", listingMethods.productsOfCategory);

app.get("/orderproducts", orderMethods.products);
app.post("/updateProducts", orderMethods.updateProducts);

/*
var messengerMethods=require("./methods/messengerMethods.js");
*/
	
/*	
app.get("/numberOfProducts", orderMethods.numberOfProducts);
app.get("/cost", orderMethods.cost);
app.get("/buy", orderMethods.buy);
app.get("/ordersHeCanTake", messengerMethods.ordersHeCanTake);
*/