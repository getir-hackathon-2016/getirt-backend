var dbCon = require("../dbConnection");
var tools = require("./tools");
var constants = require("../constants");
 
/**
* categories : mevcut kategorilerin isimlerini ve string tipinden idlerini dondurur
*/
module.exports.categories = function(req,res){
	dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
		if(err){
			console.error('There was an error connecting db!', err);
		}else{
			var categories=db.collection("categories");
			if(req.headers.appsecret==constants.appSecret){
				categories.find().toArray(function(err,cats){
					if(!err){
						res.write("{'result':true,'categories':"+JSON.stringify(cats)+"}");
						res.end();
					}else{
						res.write("{'result':false,'message':'Error'}");
						res.end();
					}
				});
			}
		}
	});
}
		
/**
* productsOfCategory : istenilen kategorinin urunlerini istenilen aralikta siralar
* @param {string} req.params.catNo - kategorinin dbdeki string tipinden idsi
* @param {number} req.params.start - urunler siralanirken kac tane atlanacagi
* @param {number} req.params.howmany - kac urun listelenecegi
* @param {number} stockNo - kullanicinin en yakin oldugu deponun dbdeki idsi
*
*/
module.exports.productsOfCategory = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				var users=db.collection("users");
				users.find({"sessionCode":req.headers.sessioncode}).toArray(function(err,user){
					if(user.length==1){
						var stockNo="56c7bf93401261c663bdee64";//güncel olarak alinacak
						db.collection("products").find({"catNo":req.params.catNo}).limit(eval(req.params.howmany)).skip(eval(req.params.start)).toArray(function(err,products){
							res.write("{'result':true,'products':"+JSON.stringify(products)+"}");
							res.end();
						});
					}else{
						res.write("{'result':false,'message':'Please login'}");
						res.end();
					}
				});
			}
		});
	}else{
		res.write("{'result':false,'message':'appsecret kodu yanlis.'}");
		res.end();
	}
}