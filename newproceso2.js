var page = require('webpage').create();
var casper = require('casper').create();
var casper = require('casper').create({
        remoteScripts: [ 'http://code.jquery.com/jquery-2.1.3.min.js','https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js' ]
});

var cookieFileName = '/var/www/carsarrive.gq/web/cookie.txt';
var fs = require('fs');
var cookies = fs.read(cookieFileName);
phantom.cookies = JSON.parse(cookies);

casper.start("https://www.carsarrive.com/tab/TransportManager/Default.asp");
casper.waitForSelector('form[method="post"]', function() {
casper.fillSelectors('form[method="post"]', {
        }, true);
});

casper.then(function(){

buscarcargas();
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
casper.reload(function() {
buscarcargas();
    });
    });
//AQUI LLAMO A LA FUNCION DE BUSCAR
function buscarcargas() {
	function getCellContent(row, cell) {
	cellText = casper.evaluate(function(row, cell) {
        	return document.querySelectorAll('table tbody tr')[row].childNodes[cell].innerText.trim();
	}, row, cell);
    	return cellText;
}
casper.then(function() {
	var rows = casper.evaluate(function() {
        	return document.querySelectorAll('table tbody tr');
    	});
    	length = rows.length;
	//casper.echo("rows: "+length);
});
	var pricearr = [];
	var loadarr = [];
	var file = require('fs');
	var content = "", content2 = "", content3 = "", f = null, ff = null, fff = null, loadedid = null, flag1=0;
	f = file.open("/var/www/carsarrive.gq/web/history.php", "r");
	ff = file.open("/var/www/carsarrive.gq/web/cargas.php", "r");
	fff = file.open("/var/www/carsarrive.gq/web/controller.php", "r");
	content = f.read();
	content2 = ff.read();
	content3 = fff.read();
	if (content3 == 0){
		//casper.echo("APAGAR");
	}else{
	var loadedida = "", loadedidb = "";
	if (content) {
		loadedida = content.split("\n");
		if (loadedida.length >1){
		for (var l = 0; l < loadedida.length - 1; l++) {
		loadedidb = loadedidb.concat(loadedida[l]);
		}
		loadedid = loadedidb.split(",");
		}else{
		loadedid = content.split(",");
		}
	}else{loadedid=0;}
		//casper.echo("largo: "+loadedid.length);
	casper.echo(document.moment());
    	for (var i = 10; i < length - 3; i++) {
		if (getCellContent(i, 3) == 1 && getCellContent(i, 9) == "FL" && getCellContent(i, 13) == "FL") {
		casper.echo(new Date() +" FOUND!: LoadID: "+ getCellContent(i, 1) +" CARS: "+getCellContent(i, 3)+" MMAX: "+getCellContent(i, 15)+" <= "+casper.cli.get("mmax")+ " PMIN: "+getCellContent(i, 17).substr(1)+ " >= "+casper.cli.get("pmin"));
		}
		if (getCellContent(i, 3) == 1 && getCellContent(i, 9) == "FL" && getCellContent(i, 13) == "FL" && getCellContent(i, 15) <= casper.cli.get("mmax") && getCellContent(i, 17).substr(1) >= casper.cli.get("pmin") ) {
		for (var k = 0, len = loadedid.length; k < len; k++) {
			casper.echo(loadedid[k]);
			if (loadedid[k] == getCellContent(i, 1)){
			flag1=1;
			casper.echo("Coincidencia encontrada: "+loadedid[k]);
    		}
		}
	if (flag1 == 0){
			loadarr.push(getCellContent(i, 1));
			pricearr.push(getCellContent(i, 17).substr(1));}
	}
	flag1=0;//PONER EN CERO
    	}
	var aux = 0;
	if (pricearr.length > 0){
	for (var i = 0; i < pricearr.length - 1; i++) {
		for (var j = i+1; j < loadarr.length; j++) {
			if (pricearr[j] > pricearr[i]){
				aux = pricearr[j];
				pricearr[j] = pricearr[i];
				pricearr[i] = aux;
				aux = loadarr[j];
				loadarr[j] = loadarr[i];
				loadarr[i] = aux;
			}
		}
	}}
	//casper.echo("SPRINT");
	if (loadarr.length > 0){
		casper.echo(new Date() +"Clicking on Load ID: "+loadarr[0]+" with price: "+pricearr[0]);
    		casper.then(function() {
		this.thenOpen('https://www.carsarrive.com/tab/Transport/ViewLoadShort.asp?nload_id='+loadarr[0]+'&npickup_code=', function() {
		casper.capture("/var/www/carsarrive.gq/web/"+loadarr[0]+".png");
		this.click('input[title="Accept Now: $'+pricearr[0]+'"]');
			casper.waitForUrl("https://www.carsarrive.com/tab/Transport/ViewLoadComplete.asp?nload_id="+loadarr[0], function() {
				this.click('img[src="/tab/images/buttons/continue.gif"]');
    			});
		});
    		});
		casper.then(function() {
		        casper.waitForSelector("#frm1", function() {
		                this.fillSelectors('form#frm1', {
                		        'input[name = sdriver_name ]' : 'Juan'
		                }, false);
		        this.evaluate(function(){
		                document.querySelector('select[id="stransp_pickup_date"]').focus();
		        });
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        casper.page.sendEvent("keypress", casper.page.event.key.Enter);
		        this.evaluate(function(){
		                document.querySelector('select[id="stransp_delivery_date"]').focus();
		        });
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        this.page.sendEvent('keypress', this.page.event.key.Down);
		        casper.page.sendEvent("keypress", casper.page.event.key.Enter);
		        this.click('#nradTerms');
		        this.wait(500);
		        this.click('img[src="/tab/images/buttons/continue.gif"]');
		        var fs = require('fs');
		        fs.write('/var/www/carsarrive.gq/web/cargas.php', content2 - 1);
		        fs.write('/var/www/carsarrive.gq/web/history.php', loadarr[0]+",",'a');
			if ((content2 - 1) == 0){casper.echo("CARGADO EL ULTIMO");
		        var s = "0";
		        fs.write('/var/www/carsarrive.gq/web/controller.php', s);}
		        });
		});
	}else{
		//casper.echo("No hay cargas disponibles "+casper.cli.get("mmax")+" "+casper.cli.get("pmin"));
	}
	}
};


casper.run();
