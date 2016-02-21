var dbCon = require("../dbConnection");
var tools = require("./tools");
var constants = require("../constants");
		
/**
* buy : sepetteki urunlerin odenmesi ve teslimata cikarilmasini saglar
* @param req.headers.oturumkodu - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.buy = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				db.collection("users").find({'sessionCode':req.headers.sessioconcode}).toArray(function(err,user){
					if(user.length==1){
						db.collection("orders").find({"userNo":user[0]._id}).toArray(function(err,orders){
							var totalPrice=0;
							var allProducts={};
							for(var i in order){
								totalPrice+=orders[i].price;
							}
							db.collection("messengerTasks").insert({"products":allProducts,"price":totalPrice,"userNo":user[0]._id,"status":"0","address":req.body.address,"addressX":req.body.addressX,"addressY":req.body.addressY});
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
* cost : siparislerin toplam tutarini verir
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
* products : siparisler sepetindeki urunleri listeler
* @param req.headers.sessioncode - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.products = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				db.collection("users").find({'sessionCode':req.headers.sessioncode}).toArray(function(err,user){
					if(user.length==1){
						var userid=JSON.stringify(user[0]._id);
						db.collection("orders").find({"userNo":userid}).toArray(function(err,orderProducts){
							db.collection("products").find().toArray(function(err,allProducts){
								for(var i in orderProducts){
									for(var t in allProducts){
										if(JSON.stringify(orderProducts[i].productNo)==JSON.stringify(allProducts[t]._id)){
											orderProducts[i].name=allProducts[t].name;
											break;
										}
									}
								}
								res.write("{'result':true,'basketProducts':"+JSON.stringify(orderProducts)+"}");
								res.end();
							});
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
* updateProducts : istenilen urunun sepetteki durumunu gunceller
* @description <Uyenin ilgili urune ait herhangi bir siparisi yoksa yeni bir siparis yaratir,
* zaten siparis varsa urunun siparisteki sayisini gunceller ve urunler collectioninda
* urunun sayisini gunceller. Siparisteki urun adedi eksiliyorsa depodaki urun sayisi onemsizdir ve arttirilir,
* urun sayisi artiyorsa depoda yeterli urun var mi kontrol edilir>
* @param {string} req.body.productNo - urunun dbdeki idsi
* @param {number} idsi - mongodbde _id secilebilmesi icin urunun string tipinden idsinden uretilmis mongodb objesi
* @param {string} req.body.doo - urun adedinin guncellenmesi, azaltilmasi veya arttirilmasinin soylenmesi
* @param {number} req.body.number - urunun adedinin guncellenmek, arttirilmak veya azaltilmak istenen degeri
* @param req.headers.sessioncode - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
*
*/ 
module.exports.updateProducts = function(req, res){
	if(req.headers.appsecret==constants.appSecret){
		dbCon.MongoClient.connect(dbCon.dbUrl, function (err, db) {
			if(err){
				console.error('There was an error connecting db!', err);
			}else{
				db.collection("users").find({"sessionCode":req.headers.sessioncode}).toArray(function(err,user){
					if(user.length==1){
						var idsi=dbCon.ObjectID(req.body.productNo);
						var products=db.collection("products");
						var orders=db.collection("orders");
						products.find({"_id":idsi}).toArray(function(err,product){
							orders.find({"userNo":JSON.stringify(user[0]._id),"productNo":product[0]._id}).toArray(function(err,order){
								req.body.number=eval(req.body.number);
								if(order.length==0){var startNumber=0;}else{var startNumber=order[0].number;}
								if(req.body.doo=="increase"){
									req.body.number=startNumber+req.body.number;
								}else if(req.body.doo=="decrease"){
									req.body.number=startNumber-req.body.number;
								}else if(req.body.doo=="update"){
									//nothing to do
								}
								
								if(order.length==0){
									if(req.body.number>0){
										if(product[0].number>=req.body.number){
											orders.insert({"userNo":JSON.stringify(user[0]._id),"productNo":product[0]._id,"price":(req.body.number*product[0].price),"number":req.body.number},function(err,result){
												products.updateOne({"_id":idsi},{$set:{"number":(product[0].number-req.body.number)}},function(err,result){
													res.write("{'result':true,'message':'Ürün sepete eklendi'}");
													res.end();
												});
											});
										}else{
											res.write("{'result':false,'message':'Depomuzda yeterli urun olmadigindan sayiyi arttiramiyoruz'}");
											res.end();
										}
									}else{
										res.write("'result':false,'message':'Değişiklik yok 1'");
										res.end();
									}
								}else{
									if(req.body.number>order[0].number){
										if(product[0].number>=order[0].number-req.body.number){
											orders.updateOne({"userNo":JSON.stringify(user[0]._id),"productNo":product[0]._id},{$set:{"number":req.body.number}},function(err,result){
												products.updateOne({"_id":idsi},{$set:{"number":(product[0].number-(req.body.number-order[0].number))}},function(err,result){
													res.write("{'result':false,'message':'Ürünler sepete eklendi'}");
													res.end();
												});
											});
										}else{
											res.write("{'result':false,'message':'Depomuzda yeterli urun olmadigindan sayiyi arttiramiyoruz'}");
											res.end();
										}
									}else if(req.body.number<order[0].number){
										if(req.body.number>0){
											orders.updateOne({"userNo":user[0]._id,"productNo":product[0]._id},{$set:{"number":req.body.number}},function(err,result){
												products.updateOne({"_id":idsi},{$set:{"number":(product[0].number+(order[0].number-req.body.number))}},function(err,result){
													res.write("{'result':true,'message':'Ürün sayısı eksiltildi'}");
													res.end();
												});
											});
										}else{
											orders.deleteOne({"userNo":user[0]._id,"productNo":product[0]._id},function(err,result){
												res.write("{'result':true,'message':'Ürün sepetten kaldırıldı'}");
												res.end();
											});
										}
									}else{
										res.write("{'result':false,'message':'Değişiklik yok 2'}");
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
		});
	}
}