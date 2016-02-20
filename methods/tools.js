var crypto=require("crypto");
getSeconds = function(){
	return Math.floor(new Date().getTime()/1000);
}

exports.getSeconds = getSeconds;

exports.validateEmail=function(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

exports.generateMpassword=function(password){
	return crypto.createHash('md5').update(password+"krnnrk").digest('hex');
}

exports.createSessionCode=function(email){
	return crypto.createHash('md5').update(email+getSeconds()+"utyrh").digest('hex');
}