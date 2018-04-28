const unirest = require('unirest');
const yargs = require('yargs');

var func = () => {
	var lat = 29.620444;
	var lng = -82.376514;
	var lat2 = 29.520444;
	var lng2 = -81.276514;	
	const agency = 116;

	//Get all bus numbers running in agency 116 (University of Florida)
	var queryString = `agencies=${agency}&callback=call`;//&geo_area=${lat}%2C${lng}%7C${lat2}%2C${lng2}`
	var uriQuery = encodeURI(queryString);
	
	unirest.get(`https://transloc-api-1-2.p.mashape.com/routes.json?${queryString}`)
	.header("X-Mashape-Key", "84AqoE1KCImshBFBXYICXBMaLJVVp1ZlNPhjsnoWHxpEPW3x1S")
	.header("Accept", "application/json")
	.end(function (result) {
		for (let bus of result.body.data["116"]) {
			console.log(bus.short_name);
		}
	});

	unirest.get("https://transloc-api-1-2.p.mashape.com/stops.json?agencies=116%2C16&callback=call")
	.header("X-Mashape-Key", "84AqoE1KCImshBFBXYICXBMaLJVVp1ZlNPhjsnoWHxpEPW3x1S")
	.header("Accept", "application/json")
	.end(function (result) {
		for (let stop of result.body.data) {
			if (stop.name.startsWith("Aspen")){
				console.log(stop.name);	
			}
			
		}  		
	});
}

func();

