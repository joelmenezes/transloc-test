const unirest = require('unirest');
const yargs = require('yargs');

const geocode = require('./geocode');

const agency = 116;
sourceBuses = [];
destinationBuses = [];
//35.80176,-78.64347|35.78061,-78.68218
//29.620444,-82.376514|29.520444,-81.276514

const argv = yargs.options({
	a: {
		demand: true,
		alias: 'source',
		describe: 'Address for source',
		string: true
	},
	b: {
		demand: true,
		alias: 'destination',
		describe: 'Address for destination',
		string: true
	}
}).help().alias('help', 'h').argv; 

var aToB = (source, destination) => {

	source = source + "Gainesville, Florida";
	destination = destination + "Gainesville, Florida";

	geocode.geocodeAddress(source, (err, res) => {
		if(err) {
			console.log(err);
		}
		else {
			getSourceRoutes(res.latitude, res.longitude);
		}
	});

	geocode.geocodeAddress(destination, (err, res) => {
		if(err) {
			console.log(err);
		}
		else {
			getDestinationRoutes(res.latitude, res.longitude);
		}
	});

}

console.log(argv.source, argv.destination);
aToB(argv.source, argv.destination);


var getSourceRoutes = (lat, lng) => {
	var query = `agencies=${agency}%2C16&callback=call&geo_area=${lat}%2C${lng}%7C${lat - 0.001}%2C${lng - 0.001}`;
	unirest.get(`https://transloc-api-1-2.p.mashape.com/routes.json?${query}`)
	.header("X-Mashape-Key", "84AqoE1KCImshBFBXYICXBMaLJVVp1ZlNPhjsnoWHxpEPW3x1S")
	.header("Accept", "application/json")
	.end(function (result) {
		console.log("SOURCE BUSES");
  		for (let bus of result.body.data["116"]) {
			//console.log(bus.short_name);
			sourceBuses.push(bus.short_name);
		}
	});
}

var getDestinationRoutes = (lat, lng) => {
	var query = `agencies=${agency}%2C16&callback=call&geo_area=${lat + 0.002}%2C${lng + 0.002}%7C${lat - 0.002}%2C${lng - 0.002}`;
	unirest.get(`https://transloc-api-1-2.p.mashape.com/routes.json?${query}`)
	.header("X-Mashape-Key", "84AqoE1KCImshBFBXYICXBMaLJVVp1ZlNPhjsnoWHxpEPW3x1S")
	.header("Accept", "application/json")
	.end(function (result) {
		console.log("DESTINATION BUSES");
  		for (let bus of result.body.data["116"]) {
  			//console.log(bus.short_name);
			destinationBuses.push(bus.short_name);
		}
	});
}

if (sourceBuses.length == 0 || destinationBuses.length == 0) {
	setTimeout (() => {
		result = sourceBuses.filter((n) => destinationBuses.includes(n));
		console.log(result);
	}, 2500);
}

/*
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
			console.log(stop.name);
		}  		
	});
}

func();

*/