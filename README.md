/server.js: serverın sürekli çalışan ana aktivitesi

/constants.js: Bazı yerlerde kullanılan constantlar

/dbConnection.js: Veritabanı unsurlarının export edildiği dosya

/fakeMessengerMotion.html:
Normalde kuryenin cep telefonundan serverımıza soketler aracılığıyla gelen konum verilerini sipariş bekleyen müşteriye yine serverımız tarafından göndermekteyiz ve google maps üzerinde konumu sürekli güncellemekteyiz. Pratikte hareketli bir kurye kullanamayacağımız için bu html dosyasından serverımıza 2 saniyede bir, daha önceden belirlenen meridyen koordinatlarını alarak tıpkı bir kuryeyi simüle ediyoruz.

Android uygulamamızda sipariş tamamlandıktan sonra açılan harita kapatılmadan bu html dosyası çalıştırıldığında, açılan o haritada kuryenin hareketinin simüle edildiğini görebilirsiniz.

/methods/
tools.js: Kısa metotların export edildiği dosya.
userMethods.js: Kaydolma ve giriş metotları
orderMethods.js: sipariş için ürün ekleme, çıkarma, sepetteki ürünleri görme, siparişi tamamlama metotları

listingMethods.js: kategorileri ve herhangi bir kategorinin ürünlerini listeleyen metotlar

messengerMethods.js: Tamamlanamadı

TABLOLAR
 
users
_id name email mpassword sessionCode address addressX
addressY  creditCard now

Açıklama: kullanıcıların bilgilerinin tutulduğu tablo
name, email, address: kullanıcıdan alınan temel bilgiler;
mpassword: parolanın geri dönüştürelemez şekilde özelleşmiş halidir;
sessionCode: üye girişi sırasında üyeye ve zamana özel üretilmiş benzersiz koddur;
addressX ve addressY sipariş verilmesi durumunda kişinin geometrik konumunudur;
now: üyenin sisteme kaydolduğu zamanın saniye cinsinden değeridir.
 
messengers
_id name locationX locationY telephone mpassword sessionCode  nearStock stockNo

Açıklama: kurye bilgilerinin tutulduğu tablo
name, telephone: kuryenin temel bilgileri;
locationX ve locationY: kuryenin soketlerle anlık olarak  alınan konumu;
nearStock: kuryenin dağıtım yaptığı depoda olup olmadığı bilgisidir, diğer bir deyişle yeni dağıtım için uygun olup olmadığıdır.

products
_id name number price stockNo catNo

Açıklama: ürünlerin bilgilerinin tutulduğu tablo
name, price: ürünün temel bilgileri;
number: ürünün ilgili depoda kaç tane bulunduğunun değeri;
stockNo: ürünün malları aldığı deponun nosu;
catNo: ürünün kategorisinin numarasıdır.
 
orders
_id userNo productNo number price

Açıklama: üyelerin sipariş vermek üzereykenki ürünlerin tablosu
userNo: ürün siparişinin hangi üyeye ait olduğu;
productNo: ilgili ürünün products tablosundaki id değeri;
number: ilgili üründen kaç tane istendiğinin değeri;
price: ürün fiyatı * ürün sayısı olarak elde edilen tutar,
kampanyalar vs. ile price başka sonuçlar verebilir
 
messengerTasks
_id userNo products price status address addressX addressY messengerNo status0time status1time status2time

Açıklama: Ücreti ödenmiş ve dağıtımı bekleyen siparişlerin tablosu;
userNo: ödemenin sahibi
products: orders tablosundaki tüm ürünlerin tek bir yerde  toplanmış halidir;
price: siparişin tutarıdır;
status: 0=depoda beklemede 1=dağıtımda 2=teslim edildi  3=iptal/özel durum;
address: teslimat yapılacak adresin bilinen ismi;
addressX ve addressY: teslimat yapılacak yerin geometrik konumları;
messengerNo: status 1 veya 2 ise ilgili kuryenin tablosundaki  idsi;
status0time, status1time ve status2time: siparişin ödemeden itibaren bulunduğu durumların saniye cinsinden tarihi
 
stocks
_id name locationX locationY

Açıklama: lokasyonlara göre dağıtılmış depo numaraları
name: Getir elemanlarının depoyu andığı isim;
locationX, locationY: deponun geometrik konumu

categories
_id name

Açıklama: Ürünlerin sınıflandırılacağı tablo
name: Kategori adı