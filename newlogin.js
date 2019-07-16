var page = require('webpage').create();
var casper = require('casper').create();
var casper = require('casper').create({
	remoteScripts: [ "http://code.jquery.com/jquery-2.1.3.min.js" ]
});
var urlBeforeLoggedIn = "https://login.carsarrive.com/?q=sso/idplogin&destination=sso/idplogin";
var urlAfterLoggedIn = "https://www.carsarrive.com/tab/TransportManager/Default.asp";
var urlSearch = "https://www.carsarrive.com/tab/Transport/FindLoads.asp";
casper.start(urlBeforeLoggedIn);
casper.waitForSelector('form[method="post"]', function() {
casper.fillSelectors('form[method="post"]', {
	'input[name="name"]': 'marron',
	'input[name="pass"]': 'CarsArrive1030'
	}, true);
});
casper.waitForUrl(urlAfterLoggedIn,function() {
casper.then(function(){
        this.mouse.click({ type: 'xpath' , path: "/html/body/div[2]/div[2]/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td/table/tbody/tr/td[2]/div/select"});
        casper.page.sendEvent("keypress", casper.page.event.key.M);
        casper.page.sendEvent("keypress", casper.page.event.key.M);
        casper.page.sendEvent("keypress", casper.page.event.key.Enter);
        this.wait(1000);
});
casper.then(function(){
        this.mouse.click({ type: 'xpath' , path: "/html/body/div[2]/div[2]/table/tbody/tr[2]/td/form/table/tbody/tr[2]/td/table/tbody/tr[2]/td[2]/div/select"});
        casper.page.sendEvent("keypress", casper.page.event.key.M);
        casper.page.sendEvent("keypress", casper.page.event.key.M);
        casper.page.sendEvent("keypress", casper.page.event.key.Enter);
        this.wait(1000);
		casper.capture("login.png");
});
});
casper.then(function(){
        this.wait(3000);
        this.sendKeys('#load_ids', casper.page.event.key.Enter , {keepFocus: true});
});
casper.waitForUrl(urlSearch,function() {
    casper.capture("1.png");
var cookies = JSON.stringify(phantom.cookies);
var fs = require('fs');
fs.write("cookie.txt", cookies, "w");
    });
casper.run();
