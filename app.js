require('dotenv').load();

const request = require('request');
const yargs = require('yargs');
const axios = require('axios');
const unirest = require('unirest');
const async = require('async');

const agency = 116;

//sourceBuses = [];
destinationBuses = [];

// Getting address from user using CLI
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

var sourceURI = encodeURIComponent(argv.source + ", Gainesville, Florida");
var destinationURI = encodeURIComponent(argv.destination + ", Gainesville, Florida");

var sourceGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + sourceURI;
var destinationGeocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + destinationURI;

console.log(sourceGeocodeUrl);
console.log(destinationGeocodeUrl);

var getRoutes = (geocodeUrl) => {
	routesData = [];

	return new Promise((fulfilled, rejected) => {
		axios.get(geocodeUrl).then((response) => {
			if (response.data.status === 'ZERO_RESULTS') {
				throw new Error ("Unable to find the address");
			}

			let lng = response.data.results[0].geometry.location.lng;
			let lat = response.data.results[0].geometry.location.lat;
			
			console.log(lat, lng);
			var query = `agencies=${agency}%2C16&callback=call&geo_area=${lat + 0.001}%2C${lng + 0.001}%7C${lat - 0.001}%2C${lng - 0.001}`;
			var requestURL = `https://transloc-api-1-2.p.mashape.com/routes.json?${query}`;

			return axios.get(requestURL, {
				headers: {
					"X-Mashape-Key": process.env.MASHAPE_KEY,
					"Accept": "application/json"	
				}
			});
		}).then((response) => {
			
			if (response.data.data.length == 0) {
				throw new Error ("Could not find any data for requested stop");
			}

			for (let route of response.data.data["116"]){
				routesData.push({
					short_name: route.short_name, 
					route_id: route.route_id ,
					long_name: route.long_name ,
					stops: route.stops
				});
			}

			fulfilled(routesData);

		}).catch(function (error) {
	    	if (error.code === 'ENOTFOUND') {
				rejected("Unable to connect to API servers");
			}
			else {
				rejected(error.message);
			}

	  	});	
	});
	
}

var stack = [];

stack.push(getRoutes(sourceGeocodeUrl));
stack.push(getRoutes(destinationGeocodeUrl));


Promise.all(stack).then((res) => {
	var sourceRoutes = res[0];
	
	for (let route of sourceRoutes) {
		console.log(route.short_name);
	}

	var destinationRoutes = res[1];
	getSourceToDestinationRoutes(sourceRoutes, destinationRoutes);

}).catch((err) => {
	console.log(err);
})

var getSourceToDestinationRoutes = (sourceRoutes, destinationRoutes) => {
	/*var props = ['route_id', 'short_name'];

	var result = sourceRoutes.filter((source) => {
	    	return destinationRoutes.some((destination) => {
	        	return source.route_id === destination.route_id;          // assumes unique id
    		});
	}).map(function(o){
	    // use reduce to make objects with only the required properties
	    // and map to apply this to the filtered array as a whole
	    return props.reduce(function(newo, short_name){
	        newo[short_name] = o[short_name];
	        return newo;
	    }, {});
	});*/

	/*console.log("SOURCE");
	for(let a of sourceRoutes) {
		console.log(a.short_name);
	}

	console.log("Destination");
	for(let a of destinationRoutes) {
		console.log(a.short_name);
	}

	result = [];
	for (let a of sourceRoutes) {
		for (let b of destinationRoutes) {
			if (a.short_name === b.short_name) {
				console.log("Common");
				console.log(b.short_name);
			}
		}
	};
	console.log(result);*/
}

//[ '12', '34', '35', 'B', '37', '36', 'F' ]

