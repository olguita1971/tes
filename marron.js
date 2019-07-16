var sys = require("system"),
    page = require("webpage").create(),
    logResources = false,
    jquery = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";

// TODO not available date select max available DONE!
// TODO minimum on price 												DONE!
// TODO add load needed to avoid over bidding 	DONE!


page.open('https://login.carsarrive.com/', function() {
    page.includeJs(jquery, function() {
        page.evaluate(function() {
            $.get("https://carsarrive.firebaseio.com/server/.json", function(data) {
                if (typeof window.callPhantom === 'function') {
                    //var args = window.callPhantom(data);
                    window.callPhantom(data);
                    //alert(args);
                }
                //console.log(JSON.stringify(data));                                  
/*
                var today = new Date();
                var appdate = new Date(data.date);
                if (appdate < today) {
                    console.log("Failed datecheck");
                    return;
                }
*/
                if ($('#edit-name--2').length == 1) {
                    $('#edit-name--2').val(data.usr).change();
                    $('#edit-pass--2').val(data.pwd).change();
                    $('#edit-submit--2').click();
                }
            }); //$.get
        });// page.evaluate
    });//page.includeJs
});//page.open


var loads = 0;
var args;


/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments: 
 * the string for the message, the line number, and the source identifier.
 */
page.onConsoleMessage = function(msg, line, source) {
    if (msg.indexOf('>') == 13 ) {		
        console.log(msg);
    }
};


page.onCallback = function(data) {
    if (data) {
        args = data;
        //return args;
    }
    return args;
};


page.onLoadFinished = function() {
    //console.log("page.onLoadFinished " + page.url);
    loads += 1;


    if (loads % 50 === 0 || args.sleep || args.loads<1) {
        firebasecheck();
    } else {
        page.evaluate(main);
    }

    function firebasecheck() {
        page.evaluate(function(main) {
            try {
								var args;
								if (typeof window.callPhantom === 'function') {
										args = window.callPhantom();
								}


								$.get("https://carsarrive.firebaseio.com/server/.json", function(data) {
									
									//sync local ignore list with remote
									if(args.localignore!=null){
										data.ignore +=args.localignore.join(" ")+" ";
									}
									if(args.found!=null){
										data.loads-=args.found;
										if(data.loads<1){
											data.sleep=true;
										}
									}

									$.ajax({
											accept: "application/json",
											type: 'POST',
											contentType: "application/json; charset=utf-8",
											dataType: "json",
											url: "https://carsarrive.firebaseio.com/server/.json",
											headers: {
													"X-HTTP-Method-Override": "PATCH"
											},
											data: JSON.stringify({
													"timestamp": (new Date()).toString(),
													"ignore": data.ignore,
													"loads": data.loads,
													"sleep": data.sleep
											}),
											success: function() {
												try {
														if (typeof window.callPhantom === 'function') {
																window.callPhantom(data);
																//alert(args);
														}
														//console.log(JSON.stringify(data));
														if (!data.sleep) {
																main();
														} else {
																setTimeout(function() {
																		window.location.href = "https://www.carsarrive.com/tab/TransportManager/Default.asp";
																}, 6666);
														}
												} catch (e) {
														console.log('firebasecheck(): ' + e.message);
														main();
												}

											} // success
									});
								}); //$.get
            } catch (e) {
                console.log('Error1: ' + e.message);
                main();
            }

        }, main); //page.evaluate
    }


    function main() {
        try {
            var args;
            if (typeof window.callPhantom === 'function') {
                args = window.callPhantom();
            }

            function Results(results) {
                var items;

                this.get = function(i) {
                    return {
                        "id": $(items[i]).find('> td:nth-child(1)').html().trim(),
                        "cars": $(items[i]).find('> td:nth-child(2)').html().trim(),
                        "model": $(items[i]).find('> td:nth-child(3)').html().trim(),
                        "origCity": $(items[i]).find('> td:nth-child(4)').html().trim(),
                        "origargse": $(items[i]).find('> td:nth-child(5)').html().trim(),
                        "destCity": $(items[i]).find('> td:nth-child(6)').html().trim(),
                        "destargse": $(items[i]).find('> td:nth-child(7)').html().trim(),
                        "milage": Number($(items[i]).find('> td:nth-child(8)').html().trim()),
                        "priceShip": Number($(items[i]).find('> td:nth-child(9)').html().trim().split('$')[1]),
                        "priceMile": Number($(items[i]).find('> td:nth-child(10)').html().trim().split('$')[1]),
                        "link": $(items[i]).find('> td:nth-child(11) > a:nth-child(1)').attr('href').trim(),
                        "comments": $(items[i]).find('> td:nth-child(12)').html().trim(),
                        "timestamp": (new Date()).toString()
                    };
                };
                items = results;
            } // Results

            var milageMax = args.milage;
            var priceLimit = args.price;
            var ignoreIds = args.ignore;
						var loads = args.loads;
						
						if(args.localignore!=null){
							ignoreIds += args.localignore.join(" ")+" ";
						}

						if(args.found!=null){
							console.log("args.found!=null " + args.found);
							
							console.log("args.loads " + args.loads);

							// the loads has been updated locally
							// do something here

							console.log("args.found-args.loads==0 " + args.found-args.loads==0);
							if(args.found-args.loads<1){
								console.log("in ");

								// were done searching
								// loop to search page
                searchAgain();
							}
						}

						
            var url = document.location.href.split('?')[0];
            var login = 'https://login.carsarrive.com/';
            var findLoads = 'https://www.carsarrive.com/tab/Transport/FindLoads.asp';
            var viewLoadShort = 'https://www.carsarrive.com/tab/Transport/ViewLoadShort.asp';
            var viewLoadComplete = 'https://www.carsarrive.com/tab/Transport/ViewLoadComplete.asp';
            var whereToSend = 'https://www.carsarrive.com/tab/Transport/WhereToSend.asp';
            var searchPage = 'https://www.carsarrive.com/tab/TransportManager/Default.asp';
            var confirm = 'https://www.carsarrive.com/tab/Transport/LoadAssigned2.asp';
            var denied = 'https://www.carsarrive.com/tab/AccessDenied.asp';


            switch (url) {
                case login:
										print("Logged in!");
                    break;
                case findLoads:
                    checkResults();
                    break;
                case viewLoadShort:
                    ViewLoadShort();
                    break;
                case viewLoadComplete:
                    ViewLoadComplete();
                    break;
                case whereToSend:
                    WhereToSend(args.user, args.pickup, args.deliver);
                    break;
                case searchPage:
                    doSearch();
                    break;
                case confirm:
                    confirmed();
                    break;
                case denied:
                    break;
                default:
                    print("Error: " + url);
                    searchAgain();
                    break;
            }


            function doSearch() {
                try {
                    //print('Searching ...');
                    var submit = "#frm1 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(5) > td:nth-child(1) > a:nth-child(1)";
                    // selects for origin & destination
                    var $orig = $("#asmSelect0");
                    var $dest = $("#asmSelect1");
                    // var miami = "6_10_12";
                    // var florida = "6_10_0";

                    $orig.val(args.orig).change();
                    $dest.val(args.dest).change();

                    $(submit).click();
                } catch (e) {
                    console.log('doSearch(): ' + e.message);
                    searchAgain();
                }
            }

            function checkResults() {
                try {
                    var results = $('.odd, .even').length;

                    if (!results) {
                        searchAgain();
                    } else {
												print("Results: " + results);
                        found();
                    }
                } catch (e) {
                    console.log('checkResults(): ' + e.message);
                    searchAgain();
                }
            }

            function found() {
                try {
                    var $results = $('.odd, .even');
                    var found = false;
                    var greedy = -1;
                    var I = -1;

                    var results = new Results($results);

                    for (var i = 0; i < $results.length; i++) {

												if(ignoreIds.indexOf(results.get(i).id) < 0 ){
													if (results.get(i).cars == Number(1)) {
														if (results.get(i).priceShip >= Number(priceLimit)) {
															if (results.get(i).milage <= Number(milageMax)){
																	found = true;
																	if (Number(greedy) < results.get(i).priceShip) {
																			greedy = results.get(i).priceShip;
																			I = i;
																	}
															} else {
																			print(results.get(i).id + " exceeds milage " + results.get(i).milage);
															}
														} else {
																		print(results.get(i).id + " not meet price " + results.get(i).priceShip);
														}
													} else {
																print(results.get(i).id + " has more than 1 car");
													}
												}else{
													print(results.get(i).id + " is in the ignore list");
												}
                    }

                    if (found) {
											print("found "+results.get(I).id);
												/*
                        $.ajax({
                            accept: "application/json",
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            url: "https://carsarrive.firebaseio.com/loads/" + now() + "/.json",
                            data: JSON.stringify(results.get(I))
                            //,success: function() {                           } // success
                        });
												*/
												if (typeof window.callPhantom === 'function') {
														if(args.localignore==null){
															args.localignore = [];
														}
														
														if(args.found==null){
															args.found=0;
														}
														
														args.found+=1;
														args.localignore.push(results.get(I).id);
														window.callPhantom(args);
												}

                        print(JSON.stringify(results.get(I)));
												window.location.href = results.get(I).link;
												
                    } else {
                        searchAgain();
                    }
                } catch (e) {
                    console.log('found(): ' + e.message);
                    searchAgain();
                }
            }

            //https://www.carsarrive.com/tab/Transport/ViewLoadShort.asp?nload_id=4907345&npickup_code=
            function ViewLoadShort() {
                try {
                    print('ViewLoadShort');
                    var $accept = $('#frmYesNo > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)');

                    if ($accept.length == 1) {
                        $accept.click();
                    } else {
                        print("ViewLoadShort Failed");
                        searchAgain();
                    }
                } catch (e) {
                    console.log('ViewLoadShort(): ' + e.message);
                    searchAgain();
                }
            }
            //https://www.carsarrive.com/tab/Transport/ViewLoadComplete.asp?nload_id=4907345&npickup_code=
            function ViewLoadComplete() {
                try {
                    print('ViewLoadComplete');
                    var $continue1 = $('#frm2 > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > a:nth-child(1)');


                    if ($continue1.length == 1) {
                        $continue1.click();
                    } else {
                        print("ViewLoadComplete Failed");
                        searchAgain();
                    }
                } catch (e) {
                    console.log('ViewLoadComplete(): ' + e.message);
                    searchAgain();
                }
            }
            //https://www.carsarrive.com/tab/Transport/WhereToSend.asp
            function WhereToSend(user, pickup, deliver) {
                try {
                    print('WhereToSend');
                    var $continue1 = $('#content_contain > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(18) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(1) > a:nth-child(1)');
                    var $username = $('#sdriver_name');
                    var $pickup_date = $('#stransp_pickup_date');
                    var $delivery_date = $('#stransp_delivery_date');
                    var $rapid_ach = $('#nradTerms');

                    $username.val(user).change();

                    $pickup_date.val(pickup).change();
                    if ($pickup_date.val() != pickup) {
                        print("Failed to set $pickup_date");
                        //$pickup_date.find("option:last").attr("selected","selected");
                        $pickup_date[0].selectedIndex = $pickup_date[0].options.length - 1;
                        $pickup_date.change();
                        print($pickup_date.val());
                    }

                    $delivery_date.val(deliver).change();
                    if ($delivery_date.val() != deliver) {
                        print("Failed to set $delivery_date");
                        //$delivery_date.find("option:last").attr("selected","selected");
                        $delivery_date[0].selectedIndex = $delivery_date[0].options.length - 1;
                        $delivery_date.change();
                        print($delivery_date.val());
                    }

                    $rapid_ach.click();


                    if ($continue1.length == 1) {
                        $continue1.click();
                        //test$continue1_click();
                    } else {
                        print("WhereToSend Failed");
                        searchAgain();
                    }
                } catch (e) {
                    console.log('WhereToSend(): ' + e.message);
                    searchAgain();
                }
            }

            function confirmed() {
                print("Load Assigned!");
                searchAgain();
            }

            // function to simulate a confirmed without adding the car
            function test$continue1_click() {
                print("THIS IS JUST A TEST!!!!");
                window.location.href = confirm;
            }


            function searchAgain() {
                try {
                    window.location.href = searchPage;
                } catch (e) {
                    console.log('searchAgain(): ' + e.message);
                    searchAgain();
                }
            }

            function print(msg) {
                var time = new Date();
                var hrs = new Array((2 - time.getHours().toString().length) + 1).join('0') + time.getHours();
                var mins = new Array((2 - time.getMinutes().toString().length) + 1).join('0') + time.getMinutes();
                var sec = new Array((2 - time.getSeconds().toString().length) + 1).join('0') + time.getSeconds();
                var mil = new Array((3 - time.getMilliseconds().toString().length) + 1).join('0') + time.getMilliseconds();

                console.log(hrs + ":" + mins + ":" + sec + ":" + mil + " > " + msg);

            }

            function now() {

                var time = new Date();
                var yrs = time.getFullYear();
                var mon = new Array((2 - (time.getMonth() + 1).toString().length) + 1).join('0') + (time.getMonth() + 1);
                var day = new Array((2 - time.getDate().toString().length) + 1).join('0') + time.getDate();
                var hrs = new Array((2 - time.getHours().toString().length) + 1).join('0') + time.getHours();
                var mins = new Array((2 - time.getMinutes().toString().length) + 1).join('0') + time.getMinutes();
                var sec = new Array((2 - time.getSeconds().toString().length) + 1).join('0') + time.getSeconds();
                var mil = new Array((3 - time.getMilliseconds().toString().length) + 1).join('0') + time.getMilliseconds();

                return "" + yrs + mon + day;

            }


        } catch (e) {
            console.log('main(): ' + e.message);
        } finally {
            return;
        }

    } // main

}; //page.onLoadFinished

/*
        function getToday(days) {
            var MyDate = new Date();
            var MyDateString;

            MyDate.setDate(MyDate.getDate() + days);

            MyDateString = ('0' + (MyDate.getMonth() + 1)).slice(-2) + '/' + ('0' + MyDate.getDate()).slice(-2) + '/' + MyDate.getFullYear();

            return MyDateString;
        }
*/

/*
if (sys.args.length > 1 && sys.args[1] === "-v") {
    logResources = true;
}

page.onUrlChanged = function() {
    console.log("page.onUrlChanged");
    printArgs.apply(this, arguments);
};
page.onNavigationRequested = function() {
    console.log("page.onNavigationRequested");
    printArgs.apply(this, arguments);
};
function printArgs() {
    var i, ilen;
    for (i = 0, ilen = arguments.length; i < ilen; ++i) {
        console.log("    arguments[" + i + "] = " + JSON.stringify(arguments[i]));
    }
    console.log("");
}

if (logResources === true) {
    page.onResourceRequested = function() {
        console.log("page.onResourceRequested");
        printArgs.apply(this, arguments);
    };
    page.onResourceReceived = function() {
        console.log("page.onResourceReceived");
        printArgs.apply(this, arguments);
    };
}
*/

////////////////////////////////////////////////////////////////////////////////


/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript alert. The only argument passed to the callback is the string for the message.
 */
/*
 page.onAlert = function(msg) {
    //console.log('alert!!> ' + msg);
};
*/
/*
page.onInitialized = function() {
    console.log("page.onInitialized");
    //printArgs.apply(this, arguments);
};
page.onLoadStarted = function() {
    console.log("page.onLoadStarted");
    //printArgs.apply(this, arguments);
};

page.onLoadFinished = function() {
    console.log("page.onLoadFinished");
    printArgs.apply(this, arguments);
};


page.onRepaintRequested = function() {
    console.log("page.onRepaintRequested");
    printArgs.apply(this, arguments);
};

page.onClosing = function() {
    console.log("page.onClosing");
    //printArgs.apply(this, arguments);
};

// window.console.log(msg);

page.onConsoleMessage = function() {
    console.log("page.onConsoleMessage");
    printArgs.apply(this, arguments);
};

// window.console.log(msg);

page.onAlert = function() {
    console.log("page.onAlert");
    printArgs.apply(this, arguments);
};
// var confirmed = window.confirm(msg);
page.onConfirm = function() {
    console.log("page.onConfirm");
    printArgs.apply(this, arguments);
};
// var user_value = window.prompt(msg, default_value);
page.onPrompt = function() {
    console.log("page.onPrompt");
    printArgs.apply(this, arguments);
};

////////////////////////////////////////////////////////////////////////////////

setTimeout(function() {
    console.log("");
    console.log("### STEP 1: Load '" + step1url + "'");
    page.open(step1url);
}, 0);

setTimeout(function() {
    console.log("");
    console.log("### STEP 2: Load '" + step2url + "' (load same URL plus FRAGMENT)");
    page.open(step2url);
}, 5000);

setTimeout(function() {
    console.log("");
    console.log("### STEP 3: Click on page internal link (aka FRAGMENT)");
    page.evaluate(function() {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector("a[href='#Event_object']").dispatchEvent(ev);
    });
}, 10000);

setTimeout(function() {
    console.log("");
    console.log("### STEP 4: Click on page external link");
    page.evaluate(function() {
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector("a[title='JavaScript']").dispatchEvent(ev);
    });
}, 15000);

setTimeout(function() {
    console.log("");
    console.log("### STEP 5: Close page and shutdown (with a delay)");
    page.close();
    setTimeout(function(){
        phantom.exit();
    }, 100);
}, 20000);


phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};

*/
