// Building server express and sockets
var express = require('express'),
http = require('http'),
app = express(),
server = app.listen(8000),
io = require('socket.io').listen(server);

var dbCon = require("./dbConnection"),
bodyParser=require("body-parser");
app.use(bodyParser.json());

/**
* Kurye konumunu ve konumun iletileceği müşterinin idsi kuryenin
* telefonundan servera socket ile anlık olarak iletilir.
* Müşterinin tablodaki idsine denk gelen socket id tespit edilir
* ve müşteri hala socket ile bağlantıdaysa müşteriye kuryenin
* son konumu iletilir.
*
*  !!!!!!! örnek olması için kuryenin hareketi fakeMessengerMotion.html dosyasında simüle edilmiştir, dosyayı çalıştırınız !!!!!!!!!
*/
var socketIDS={};
io.sockets.on("connection",function(socket){
	console.log("socket connection. socketid: "+socket.id);
	
	/**
	* CONFIGURATION SOCKET EVENTI
	* Kuryeden gelen konum bilgisini müşteriye iletebilmek için
	* müşterinin socket bağlantısı olması ve socket idsi bulunması gerekmektedir.
	* Configuration müşterinin veritabanındaki idsine bağlı olarak müşterinin
	* socket id bilgisini socketIDS objesinde tutmaktadır. Yeni bir bağlantı
	* halinde müşterinin yeni socket idsi bu objede güncellenmektedir.
	*/
	socket.on("configuration",function(data){
		console.log("configuration attempt");
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				console.log("dbdeyiz");
				db.collection("users").find({"sessionCode":data.sessionCode}).toArray(function(err,user){
					console.log("users collection ici sessionCode: -"+data.sessionCode+"-");
					if(user.length==1){
						console.log("üye bulundu, idsi: "+JSON.stringify(user[0]._id));
						var useridsi=JSON.stringify(user[0]._id).replace('"','').replace('"','');
						socketIDS[useridsi]=socket.id;
						console.log("configure edildi");
						socket.send("Configure edildi");
					}else{
						console.log("üyelik eşleşmedi");
						socket.send("Üyelik bulunamadı");
					}
				});
			}
		});
		console.log(socketIDS);
	});
	
	socket.on("messenger position",function(data){
		console.log("messenger new position");
		var customerSocketId=socketIDS[data.userNo];
		if(io.sockets.connected[customerSocketId] && customerSocketId!=undefined){
			console.log("calisti");
			io.sockets.connected[customerSocketId].emit("messenger position",{"x":data.x,"y":data.y});
		}else{
			console.log("konum iletilmek istenen uyenin socket idsi kayitli degil");
		}
	});
});

// importing pratic methods
var constants=require("./constants");
var tools=require("./methods/tools.js");

// importing route methods
var userMethods=require("./methods/userMethods.js");
var listingMethods=require("./methods/listingMethods.js");
var orderMethods=require("./methods/orderMethods.js");
var messengerMethods=require("./methods/messengerMethods.js");

// routes
app.post("/register", userMethods.register);
app.post("/login",userMethods.login);
		
app.get("/categories",listingMethods.categories);
app.get("/productsofcategory/:catNo/:start/:howmany", listingMethods.productsOfCategory);

app.get("/orderproducts", orderMethods.products);
app.post("/updateProducts", orderMethods.updateProducts);
app.post("/buy", orderMethods.buy);