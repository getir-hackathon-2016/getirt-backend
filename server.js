/**
*Paketler ve sabitler, express server kurulumu ve dinlenmesi
*/
var express=require("express"),
app=express(),
mongodb = require('mongodb'),
crypto=require("crypto"),
bodyParser=require("body-parser"),
dbUrl = "mongodb://localhost:27017/getirt",
MongoClient = mongodb.MongoClient,
ObjectID = require('mongodb').ObjectID;

var appSecret="asd",
ayniUrundenMaxAdet=10;

app.listen(8000,function(){
	console.log("server basladi");
});


/**
* Genel fonksiyonlar
*/

function zaman(){
	return Math.floor(new Date().getTime()/1000);
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function generateMparola(parola){
	return crypto.createHash('md5').update(parola+"krnnrk").digest('hex');
}

function oturumKoduAl(email){
	return crypto.createHash('md5').update(email+zaman()+"utyrh").digest('hex');
}

/**
*Veritabanýna ve collectionlara baðlanýyoruz
*/

MongoClient.connect(dbUrl, function (err, db) {
	console.log("db baglantisi disi");
	if(!err){
		console.log("db baglantisi ici");
		var uyeler=db.collection("uyeler"),
		kuryeler=db.collection("kuryeler"),
		urunler=db.collection("urunler"),
		siparisler=db.collection("siparisler"),
		dagitimlar=db.collection("dagitimlar"),
		odemeler=db.collection("odemeler"),
		depolar=db.collection("depolar"),
		kategoriler=db.collection("kategoriler");
		
		app.use(bodyParser.json());
		
		/**
		* kaydol : kisiyi sisteme kaydeder
		* @description <Kiþinin girdigi bilgilerin gerekli uzunlukta ve gerceklikte olup olmadigi,
		* emailin baskasi tarafindan kullanilmadigi kontrol edilir>
		* @param {string} req.body.ad - Kisinin adi
		* @param {string} req.body.parola - Kisinin parolasi
		* @param {string} req.email - Kisinin email adresi
		* @param {string} mparola - kisinin parolasina sacma/tahmin edilemez stringler eklenip md5lenmis geri cevrilemez kod
		* @param {number} uyelikOnay - gerekli kontroller yapilmadan kisinin uye olmasina izin veren kisim, herhangi bir hatada 0a esitlenerek izin kaldiriliyor
		* @param {string} hataMesaji - Herhangi bir hata varoldugunda bu hatanin tanimini tasiyan ve uygulamaya donulen mesaj
		*
		*/
		app.post("/kaydol", function(req, res){
			if(req.headers.appsecret==appSecret){
				
				var uyelikOnay=1;
				var hataMesaji="";
				if( req.body.ad.length<=3 || req.body.ad.length>=20){
					hataMesaji="Adinizin uzunlugu 3-20 karakter araliginda olmali";
					uyelikOnay=0;
				}
				if(req.body.parola.length<5 || req.body.parola.length>20){
					hataMesaji="Parolanizin uzunlugu 5-20 karakter araliginda olmali";
					uyelikOnay=0;
				}
				if(!validateEmail(req.body.email)){
					hataMesaji="Hatali bir email adresi girdiniz";
					uyelikOnay=0;
				}
				uyeler.find({"email":req.body.email}).count(function(err,count){
					if(count > 0){
						hataMesaji="Bu email adresi kullanilmaktadir";
						uyelikOnay=0;
					}
					
					if(uyelikOnay==1){
						var mparola=generateMparola(req.body.parola);
						var simdikiZaman=zaman();
						uyeler.insert({"ad":req.body.ad,"email":req.body.email,"mparola":mparola,"zaman":simdikiZaman,"oturumKodu":"","adres":"","adresX":"","adresY":"","krediKarti":""},function(err,result){
							if(!err){
								res.write("{'result':true,'message':'Basariyla uye oldunuz'}");
								res.end();
							}else{
								res.write("{'result':false,'message':'Bilinmeyen bir nedenden dolayi uye olunamadi'}");
								res.end(); 
							}
						});
					}else{
						res.write("{'result':false,'message':'"+hataMesaji+"'}");
						res.end();
					}
					
				});//email count sorgusu sonu
				
			}else{
				res.write("appSecret yanlis");
				res.end();
			}
		});
		
		/**
		* giris : kisinin uyeliginin varolup olmadigini kontrol eder
		* @description <Girilen email ve parolaya ait bir uyelik var mi kontrol eder,
		* varsa uygulamanin herhangi bir islem yaparken hangi uyelik tarafindan
		* kullanildiginin bilinmesi icin kisiye ozel ve zamana bagli urettigi
		* essiz kodu uygulamaya geri doner>
		* @param {string} req.body.email - kisinin email adresi
		* @param {string} req.body.parola - kisinin parolasi
		* @param {string} oturumKodu - kisinin email adresine zamanin saniye cinsinden degeri ve sacma/tahmin edilemez bir stringin eklenerek md5lenmesiyle olusturulan kod
		*
		*/
		app.post("/giris", function(req, res){
			if(req.headers.appsecret==appSecret){
				uyeler.find({"email":req.body.email,"mparola":generateMparola(req.body.parola)}).count(function(err,count){
					if(!err){
						if(count==1){
							var oturumKodu=oturumKoduAl(req.body.email);
							uyeler.updateOne(
							  { "email" : req.body.email },
							  {
								$set: { "oturumKodu": oturumKodu }
							  }, function(err, results) {
								if(!err){
									res.write("{'result':true,'message':'"+oturumKodu+"'}");
									res.end();
								}else{
									res.write("{'result':false,'message':'Bilinmeyen bir hatadan dolayi giris yapilamadi'}");
									res.end();
								}
						   });
						}else{
							res.write("{'result':false,'message':'Boyle bir uyelik yok'}");
							res.end();
						}
					}else{
						res.write("{'result':false,'message':'Bilinmeyen bir hata meydana geldi'}");
						res.end();
					}
				});
			}
		});
		
		/**
		* kategoriler : mevcut kategorilerin isimlerini ve string tipinden idlerini dondurur
		*/
		app.get("/kategoriler",function(req,res){
			if(req.headers.appsecret==appSecret){
				console.log("icerde");
				kategoriler.find().toArray(function(err,kategoriler){
					console.log("asd");
					if(!err){
						res.write("{'result':true,'kategoriler':"+JSON.stringify(kategoriler)+"}");
						res.end();
					}else{
						res.write("{'result':false,'message':'Beklenmeyen bir hata olustu'}");
						res.end();
					}
				});
			}
		});
		
		/**
		* kategoriUrunleri : istenilen kategorinin urunlerini istenilen aralikta siralar
		* @param {string} req.params.kategoriNo - kategorinin dbdeki string tipinden idsi
		* @param {number} req.params.baslangic - urunler siralanirken kac tane atlanacagi
		* @param {number} req.params.kacTane - kac urun listelenecegi
		* @param {number} depoNo - kullanicinin en yakin oldugu deponun dbdeki idsi
		*
		*/
		app.get("/kategoriUrunleri/:kategoriNo/:baslangic/:kacTane", function(req, res){
			if(req.headers.appsecret==appSecret){
				uyeler.find({"oturumKodu":req.headers.oturumkodu}).toArray(function(err,uye){
					if(uye.length==1){
						var depoNo=4;//güncel olarak alinacak
						urunler.find({"kategoriNo":req.params.kategoriNo,"depoNo":depoNo}).limit(req.params.kacTane).skip(req.params.baslangic).toArray(function(err,urunler){
							res.write("{'result':true,'urunler':"+JSON.stringify(urunler)+"}");
							res.end();
						});
					}else{
						res.write("{'result':false,'message':'Uye girisi yapin'}");
						res.end();
					}
				});
			}else{
				res.write("{'result':false,'message':'appsecret kodu yanlis.'}");
				res.end();
			}
		});
		
		/**
		* urunAdediGuncelle : istenilen urunun sepetteki durumunu gunceller
		* @description <Uyenin ilgili urune ait herhangi bir siparisi yoksa yeni bir siparis yaratir,
		* zaten siparis varsa urunun siparisteki sayisini gunceller, urunler collectioninda
		* urunun sayisini gunceller. Siparisteki urun adedi eksiliyorsa depodaki urun sayisi onemsizdir ve arttirilir,
		* urun sayisi artiyorsa depoda yeterli urun var mi kontrol edilir>
		* @param {string} req.body.urunNo - urunun dbdeki idsi
		* @param {number} urunidsi - mongodbde _id secilebilmesi icin urunun string tipinden idsinden uretilmis mongodb objesi
		* @param {number} req.body.adet - urunun guncellenmek istenilen adedi
		* @param req.headers.oturumKodu - giris sirasinda uyeye ozel uretilmis zamana bagli essiz kod
		*
		*/
		app.post("/urunAdediGuncelle", function(req, res){
			if(req.headers.appsecret==appSecret){
				uyeler.find({"oturumKodu":req.headers.oturumkodu}).toArray(function(err,uye){
					if(uye.length==1){
						var urunidsi=new ObjectID(req.body.urunNo);
						urunler.find({"_id":urunidsi}).toArray(function(err,urun){
							siparisler.find({"urunEkleyen":uye[0]._id,"urunId":urun[0]._id}).toArray(function(err,siparis){
								if(siparis.length==0){
									if(adet>0){
										if(urun[0].adet>=req.body.adet){
											siparisler.insert({"siparisVeren":uye[0]._id,"urunNo":urun[0]._id,"fiyat":(req.body.adet*urun[0].fiyat),"adet":req.body.adet},function(err,result){});
											urunler.updateOne({"_id":urunidsi},{$set:{"adet":(urun[0].adet-req.body.adet)}},function(err,result){});
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
									if(adet>siparis[0].adet){
										if(urun[0].adet>=adet-req.body.adet){
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
		});
		
		/**
		* siparisVer : sepetteki urunlerin odenmesi ve teslimata cikarilmasini saglar
		*/
		app.get("/siparisVer/:siparisNo", function(req, res){
			if(req.headers.appsecret==appSecret){
				
			}
		});
	}else{
		console.dir(err);
	}
});