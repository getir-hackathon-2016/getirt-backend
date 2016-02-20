var dbCon = require("../dbConnection");
var tools = require("./tools");
var constants = require("../constants");

/**
* login : kisinin uyeliginin varolup olmadigini kontrol eder
* @description <Girilen email ve parolaya ait bir uyelik var mi kontrol eder,
* varsa uygulamanin herhangi bir islem yaparken hangi uyelik tarafindan
* kullanildiginin bilinmesi icin kisiye ozel ve zamana bagli urettigi
* essiz kodu uygulamaya geri doner>
* @param {string} req.body.email - kisinin email adresi
* @param {string} req.body.password - kisinin parolasi
* @param {string} sessionCode - kisinin email adresine zamanin saniye cinsinden degeri ve sacma/tahmin edilemez bir stringin eklenerek md5lenmesiyle olusturulan kod
*
*/
module.exports.login = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				var users=db.collection("users");
				users.find({"email":req.body.email,"mpassword":tools.generateMpassword(req.body.password)}).count(function(err,count){
					if(!err){
						if(count==1){
							var sessionCode=tools.createSessionCode(req.body.email);
							users.updateOne(
							  { "email" : req.body.email },
							  {
								$set: { "sessionCode": sessionCode }
							  }, function(err, results) {
								if(!err){
									res.write("{'result':true,'message':'"+sessionCode+"'}");
									res.end();
								}else{
									res.write("{'result':false,'message':'An error occurred'}");
									res.end();
								}
						   });
						}else{
							res.write("{'result':false,'message':'Böyle bir üyelik bulunamadı'}");
							res.end();

						}
					}else{
						res.write("{'result':false,'message':'Error'}");
						res.end();

					}
				});
			}
		});
	}
}
		
/**
* register : kisiyi sisteme kaydeder
* @description <Kişinin girdigi bilgilerin gerekli uzunlukta ve gerceklikte olup olmadigi,
* emailin baskasi tarafindan kullanilmadigi kontrol edilir>
* @param {string} req.body.name - Kisinin adi
* @param {string} req.body.password - Kisinin parolasi
* @param {string} req.email - Kisinin email adresi
* @param {string} mpassword - kisinin parolasina sacma/tahmin edilemez stringler eklenip md5lenmis geri cevrilemez kod
* @param {number} permissionToRegister - gerekli kontroller yapilmadan kisinin uye olmasina izin veren kisim, herhangi bir hatada 0a esitlenerek izin kaldiriliyor
* @param {string} errorMessage - Herhangi bir hata varoldugunda bu hatanin tanimini tasiyan ve uygulamaya donulen mesaj
*
*/
module.exports.register = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				var users=db.collection("users");
				var permissionToRegister=1;
				var errorMessage="";
				if( req.body.name.length<=3 || req.body.name.length>=20){
					errorMessage="İsminiz 3-20 karakter aralığında olmalıdır.";
					permissionToRegister=0;
				}
				if(req.body.password.length<5 || req.body.password.length>20){
					errorMessage="Parolanız 5-20 karakter aralığında olmalıdır.";
					permissionToRegister=0;
				}
				if(!tools.validateEmail(req.body.email)){
					errorMessage="Hatalı email adresi girdiniz";
					permissionToRegister=0;
				}
				users.find({"email":req.body.email}).count(function(err,count){
					if(count > 0){
						errorMessage="Bu email adresi kullanılmaktadır";
						permissionToRegister=0;
					}
					if(permissionToRegister==1){
						var mpassword=tools.generateMpassword(req.body.password);
						var now=tools.getSeconds();
						users.insert({"name":req.body.name,"email":req.body.email,"mpassword":mpassword,"now":now,"sessionCode":"","address":"","addressX":"","addressY":"","creditCart":""},function(err,result){
							if(!err){
								res.write("{'result':true,'message':'Başarıyla üye olundu'}");
								res.end();
							}else{
								res.write("{'result':false,'message':'Üye olunamadı'}");
								res.end(); 
							}
						});
					}else{
						res.write("{'result':false,'message':'"+errorMessage+"'}");
						res.end();
					}
					
				});//email count sorgusu sonu
			}
		});
		
	}else{
		res.write("{'result':false,'message':'Invalid appsecret'}");
		res.end();
	}
}