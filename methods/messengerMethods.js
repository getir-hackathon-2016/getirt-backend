		/**
		* ordersHeCanTake : orders messenger is able to carry
		* @description <method lists orders that messenger is responsible for>
		* @param req.headers.oturumkodu - giris sirasinda kuryeye ozel uretilmis zamana bagli essiz kod
		*/
		var ordersHeCanTake = function(req, res){
			if(req.headers.appsecret==appSecret){
				kuryeler.find({'oturumKodu':req.headers.oturumkodu}).toArray(function(err,kurye){
					if(kurye.length==1){
						urunler.find({"depoNo":kurye[0].depoNo}).toArray(function(err,sonuc){
							res.write("{'result':true,'urunler':"+JSON.stringify(sonuc)+"}");
							res.end();
						});
					}else{
						res.write("{'result':false,'message':'Kurye girisi yapin'}");
						res.end();
					}
				});
			}
		};