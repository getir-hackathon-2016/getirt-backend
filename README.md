/server.js: server�n s�rekli �al��an ana aktivitesi

/constants.js: Baz� yerlerde kullan�lan constantlar

/dbConnection.js: Veritaban� unsurlar�n�n export edildi�i dosya

/fakeMessengerMotion.html:
Normalde kuryenin cep telefonundan server�m�za soketler arac�l���yla gelen konum verilerini sipari� bekleyen m��teriye yine server�m�z taraf�ndan g�ndermekteyiz ve google maps �zerinde konumu s�rekli g�ncellemekteyiz. Pratikte hareketli bir kurye kullanamayaca��m�z i�in bu html dosyas�ndan server�m�za 2 saniyede bir, daha �nceden belirlenen meridyen koordinatlar�n� alarak t�pk� bir kuryeyi sim�le ediyoruz.

Android uygulamam�zda sipari� tamamland�ktan sonra a��lan harita kapat�lmadan bu html dosyas� �al��t�r�ld���nda, a��lan o haritada kuryenin hareketinin sim�le edildi�ini g�rebilirsiniz.

/methods/
|_ tools.js: K�sa metotlar�n export edildi�i dosya.
|_ userMethods.js: Kaydolma ve giri� metotlar�
|_ orderMethods.js: sipari� i�in �r�n ekleme, ��karma, sepetteki
|  			    �r�nleri g�rme, sipari�i tamamlama metotlar�
|
|_ listingMethods.js: kategorileri ve herhangi bir kategorinin
|    				 �r�nlerini listeleyen metotlar
|
|_ messengerMethods.js: Tamamlanamad�



----------------------------------------------------------
| TABLOLAR
| --------------------------------------------------------
|users
| _id name email mpassword sessionCode address addressX
| addressY | creditCard now
|
| A��klama: kullan�c�lar�n bilgilerinin tutuldu�u tablo
| name, email, address: kullan�c�dan al�nan temel bilgiler;
| mpassword: parolan�n geri d�n��t�relemez �ekilde �zelle�mi�
| halidir;
| sessionCode: �ye giri�i s�ras�nda �yeye ve zamana �zel
| �retilmi� benzersiz koddur;
| addressX ve addressY sipari� verilmesi durumunda ki�inin
| geometrik konumunudur;
| now: �yenin sisteme kaydoldu�u zaman�n saniye cinsinden
| de�eridir.
| --------------------------------------------------------
| messengers
| _id name locationX locationY telephone mpassword sessionCode | nearStock stockNo
|
| A��klama: kurye bilgilerinin tutuldu�u tablo
| name, telephone: kuryenin temel bilgileri;
| locationX ve locationY: kuryenin soketlerle anl�k olarak 
| al�nan konumu;
| nearStock: kuryenin da��t�m yapt��� depoda olup olmad���
| bilgisidir, di�er bir deyi�le
| yeni da��t�m i�in uygun olup olmad���d�r.
----------------------------------------------------------
| products
| _id name number price stockNo catNo
|
| A��klama: �r�nlerin bilgilerinin tutuldu�u tablo
| name, price: �r�n�n temel bilgileri;
| number: �r�n�n ilgili depoda ka� tane bulundu�unun de�eri;
| stockNo: �r�n�n mallar� ald��� deponun nosu;
| catNo: �r�n�n kategorisinin numaras�d�r.
| --------------------------------------------------------
| orders
| _id userNo productNo number price
|
| A��klama: �yelerin sipari� vermek �zereykenki �r�nlerin
| tablosu
| userNo: �r�n sipari�inin hangi �yeye ait oldu�u;
| productNo: ilgili �r�n�n products tablosundaki id de�eri;
| number: ilgili �r�nden ka� tane istendi�inin de�eri;
| price: �r�n fiyat� * �r�n say�s� olarak elde edilen tutar,
| kampanyalar vs. ile price ba�ka sonu�lar verebilir
| --------------------------------------------------------
| messengerTasks
| _id userNo products price status address addressX addressY
| messengerNo status0time status1time status2time
|
| A��klama: �creti �denmi� ve da��t�m� bekleyen sipari�lerin
| tablosu;
| userNo: �demenin sahibi
| products: orders tablosundaki t�m �r�nlerin tek bir yerde 
| toplanm�� halidir;
| price: sipari�in tutar�d�r;
| status: 0-> depoda beklemede 1-> da��t�mda 2->teslim edildi | 3->iptal/�zel durum;
| address: teslimat yap�lacak adresin bilinen ismi;
| addressX ve addressY: teslimat yap�lacak yerin geometrik 
| konumlar�;
| messengerNo: status 1 veya 2 ise ilgili kuryenin
| tablosundaki | idsi;
| status0time, status1time ve status2time: sipari�in �demeden
| itibaren bulundu�u durumlar�n saniye cinsinden tarihi
| ----------------------------------------------------------
| stocks
| _id name locationX locationY
|
| A��klama: lokasyonlara g�re da��t�lm�� depo numaralar�
| name: Getir elemanlar�n�n depoyu and��� isim;
| locationX, locationY: deponun geometrik konumu
----------------------------------------------------------
| categories
| _id name
|
| A��klama: �r�nlerin s�n�fland�r�laca�� tablo
| name: Kategori ad�
----------------------------------------------------------
