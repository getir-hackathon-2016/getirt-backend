-------------
  TABLOLAR
-------------
users
_id name email mpassword sessionCode address addressX addressY creditCard now

Açýklama: kullanýcýlarýn bilgilerinin tutulduðu tablo
name, email, address: kullanýcýdan alýnan temel bilgiler;
mpassword: parolanýn geri dönüþtürelemez þekilde özelleþmiþ halidir;
sessionCode: üye giriþi sýrasýnda üyeye ve zamana özel üretilmiþ benzersiz koddur;
addressX ve addressY sipariþ verilmesi durumunda kiþinin geometrik konumunudur;
now: üyenin sisteme kaydolduðu zamanýn saniye cinsinden deðeridir.


messengers
_id name locationX locationY telephone mpassword sessionCode nearStock stockNo

Açýklama: kurye bilgilerinin tutulduðu tablo
name, telephone: kuryenin temel bilgileri;
locationX ve locationY: kuryenin soketlerle anlýk olarak alýnan konumu;
nearStock: kuryenin daðýtým yaptýðý depoda olup olmadýðý bilgisidir, diðer bir deyiþle
yeni daðýtým için uygun olup olmadýðýdýr.


products
_id name number price stockNo catNo

Açýklama: ürünlerin bilgilerinin tutulduðu tablo
name, price: ürünün temel bilgileri;
number: ürünün ilgili depoda kaç tane bulunduðunun deðeri;
stockNo: ürünün mallarý aldýðý deponun nosu;
catNo: ürünün kategorisinin numarasýdýr.


orders
_id userNo productNo number price

Açýklama: üyelerin sipariþ vermek üzereykenki ürünlerin tablosu
userNo: ürün sipariþinin hangi üyeye ait olduðu;
productNo: ilgili ürünün products tablosundaki id deðeri;
number: ilgili üründen kaç tane istendiðinin deðeri;
price: ürün fiyatý * ürün sayýsý olarak elde edilen tutar,
kampanyalar vs. ile price baþka sonuçlar verebilir


messengerTasks
_id userNo products price status address addressX addressY messengerNo status0time status1time status2time

Açýklama: Ücreti ödenmiþ ve daðýtýmý bekleyen sipariþlerin tablosu;
userNo: ödemenin sahibi
products: orders tablosundaki tüm ürünlerin tek bir yerde toplanmýþ halidir;
price: sipariþin tutarýdýr;
status: 0-> depoda beklemede 1-> daðýtýmda 2->teslim edildi 3->iptal/özel durum;
address: teslimat yapýlacak adresin bilinen ismi;
addressX ve addressY: teslimat yapýlacak yerin geometrik konumlarý;
messengerNo: status 1 veya 2 ise ilgili kuryenin tablosundaki idsi;
status0time, status1time ve status2time: sipariþin ödemeden itibaren bulunduðu durumlarýn saniye cinsinden tarihi


stocks
_id name locationX locationY

Açýklama: lokasyonlara göre daðýtýlmýþ depo numaralarý
name: Getir elemanlarýnýn depoyu andýðý isim;
locationX, locationY: deponun geometrik konumu


categories
_id name

Açýklama: Ürünlerin sýnýflandýrýlacaðý tablo
name: Kategori adý