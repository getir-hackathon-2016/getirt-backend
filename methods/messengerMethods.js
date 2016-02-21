/**
* ordersHeCanTake : orders messenger is able to carry
* @description <method lists orders that messenger is responsible for>
* @param req.headers.oturumkodu - giris sirasinda kuryeye ozel uretilmis zamana bagli essiz kod
*/
module.exports.ordersHeCanTake = function(req, res){
	if(req.headers.appsecret==appSecret){
		messengers.find({'sessionCode':req.headers.sessioncode}).toArray(function(err,messenger){
			if(messenger.length==1){
				products.find({"stockNo":messenger[0].stockNo}).toArray(function(err,result){
					res.write("{'result':true,'proucts	':"+JSON.stringify(result)+"}");
					res.end();
				});
			}else{
				res.write("{'result':false,'message':'Kurye girisi yapin'}");
				res.end();
			}
		});
	}
}