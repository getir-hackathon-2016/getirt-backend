var dbCon = require("../dbConnection");
var tools = require("./tools");
var constants = require("../constants");
		
/**
* buy : sepetteki urunlerin odenmesi ve teslimata cikarilmasini saglar
* @param req.headers.oturumkodu - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.buy = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		uyeler.find({'oturumKodu':req.headers.oturumkodu}).toArray(function(err,uye){
			if(uye.length==1){

			}else{
				res.write("{'result':false,'message':'Giris yapin'}");
				res.end();
			}
		});
	}
}
		
/**
* siparisTutari : siparislerin toplam tutarini verir
* @param req.headers.oturumkodu - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.cost = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		uyeler.find({'oturumKodu':req.headers.oturumkodu}).toArray(function(err,uye){
			if(uye.length==1){
				siparisler.find({"siparisVeren":uye[0]._id}).toArray(function(err,siparisler){
					var siparisTutari=0;
					for(var i=0;i<siparisler.length;i++){
						siparisTutari+=siparisler[i].fiyat;
					}
					res.write("{'result':true,'siparisTutari':"+siparisTutari+"}");
					res.end();
				});
			}else{
				res.write("{'result':false,'message':'Giris yapin'}");
				res.end();
			}
		});
	}
}
		
/**
* numberOfProducts : siparisler listesinde kac tane urun oldugunu verir
* @param req.headers.oturumkodu - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.numberOfProducts = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				collection("users").find({'sessionCode':req.headers.sessioncode}).toArray(function(err,user){
					if(user.length==1){
						collection("orders").find({"userNo":user[0]._id}).toArray(function(err,orders){
							var productNumber=0;
							for(var i=0;i<siparisler.length;i++){
								productNumber+=orders[i].number;
							}
							res.write("{'result':true,'urunSayisi':"+urunSayisi+"}");
							res.end();
						});
					}else{
						res.write("{'result':false,'message':'Giris yapin'}");
						res.end();
					}
				});
			}
		});
	}
}
		
/**
* products : siparislere eklenen urunleri listeler
* @param req.headers.sessionCode - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.products = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				collection("users").find({'sessionCode':req.headers.sessioncode}).toArray(function(err,user){
					if(user.length==1){
						collection("orders").find({"userNo":user[0]._id}).toArray(function(err,products){
							res.write("{'result':true,'basketProducts':"+JSON.stringify(products)+"}");
							res.end();
						});
					}else{
						res.write("{'result':false,'message':'Giriş yapin'}");
						res.end();
					}
				});
			}
		});
	}
}
		
/**
* urunAdediGuncelle : istenilen urunun sepetteki durumunu gunceller
* @description <Uyenin ilgili urune ait herhangi bir siparisi yoksa yeni bir siparis yaratir,
* zaten siparis varsa urunun siparisteki sayisini gunceller ve urunler collectioninda
* urunun sayisini gunceller. Siparisteki urun adedi eksiliyorsa depodaki urun sayisi onemsizdir ve arttirilir,
* urun sayisi artiyorsa depoda yeterli urun var mi kontrol edilir>
* @param {string} req.body.productNo - urunun dbdeki idsi
* @param {number} idsi - mongodbde _id secilebilmesi icin urunun string tipinden idsinden uretilmis mongodb objesi
* @param {number} req.body.number - urunun guncellenmek istenilen adedi
* @param req.headers.sessioncode - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*
*/
module.exports.updateProducts = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		users.find({"sessionCode":req.headers.sessioncode}).toArray(function(err,user){
			if(user.length==1){
				var idsi=new ObjectID(req.body.productNo);
				products.find({"_id":idsi}).toArray(function(err,product){
					collection("orders").find({"userNo":user[0]._id,"productNo":product[0]._id}).toArray(function(err,order){
						if(order.length==0){
							if(req.body.number>0){
								if(product[0].number>=req.body.number){
									orders.insert({"userNo":user[0]._id,"productNo":product[0]._id,"price":(req.body.number*product[0].price),"number":req.body.number},function(err,result){});
									products.updateOne({"_id":idsi},{$set:{"number":(product[0].adet-req.body.number)}},function(err,result){});
									res.write("Siparisiniz olusturuldu");
									res.end();
								}else{
									res.write("{'result':false,'message':'Depomuzda yeterli urun olmadigindan sayiyi arttiramiyoruz'}");
									res.end();
								}
							}else{
								res.write("'result':false,'message':'Herhangi bir siparis vermediniz'");
								res.end();
							}
						}else{
							if(req.body.number>order[0].number){
								if(product[0].number>=adet-req.body.adet){
									siparisler.updateOne({"siparisVeren":uye[0]._id,"urunNo":urun[0]._id},{$set:{"adet":req.body.adet}},function(err,result){});
									urunler.updateOne({"_id":urunidsi},{$set:{"adet":(urun[0].adet-(adet-siparis[0].adet))}},function(err,result){});
									res.write("Urun sayisi arttirildi");
									res.end();
								}else{
									res.write("{'result':false,'message':'Depomuzda yeterli urun olmadigindan sayiyi arttiramiyoruz'}");
									res.end();
								}
							}else if(adet<siparis[0].adet){
								if(adet>0){
									siparisler.updateOne({"siparisVeren":uye[0]._id,"urunNo":urun[0]._id},{$set:{"adet":req.body.adet}},function(err,result){});
									urunler.updateOne({"_id":urunidsi},{$set:{"adet":(urun[0].adet+(siparis[0].adet-adet))}},function(err,result){});
									res.write("Urun sayisi eksiltildi");
									res.end();
								}else{
									siparisler.deleteOne({"siparisVeren":uye[0]._id,"urunNo":urun[0]._id},function(err,result){});
									res.write("Urun siparisi kaldirildi");
									res.end();
								}
							}else{
								res.write("{'result':false,'message':'Girdiginiz urun sayisi ayni'}");
								res.end();
							}
						}
					});
				});
			}else{
				res.write("{'result':false,'message':'Giris yapin'}");
				res.end();
			}
		});
	}
}