'use strict';

var app = angular.module("lorem-ipsum", ['ngClipboard']);


app.controller('formController', function($scope, wikipediaDataService, $location, $anchorScroll) {

	// Data model
	$scope.db = {
		"topics": 			[ "Science", "Art", "Economics", "History", "Politics", "Sport", "Religion", "Nature"], // # To illustrate
		"formats": {
			"sentences": 	{ "key": "sentences", 		"name": "Sentences", 	 	"echo": "regular-stylee sentences", },
			"paragraphs": 	{ "key": "paragraphs", 		"name": "Paragraphs", 	 	"echo": "long-winded paragraphs",  },
			"bulletpoints": { "key": "bulletpoints", 	"name": "Bullet points", 	"echo": "snappy bulletpoints", },
		}, 
		"outputs": {	 
			"html": 		{ "key": "html",			"name": "HTML tags", 		"echo": "HTML tags", 	},
			"plaintext": 	{ "key": "plaintext",		"name": "Plain text", 		"echo": "plain text" ,  }
		}
	}

	$scope.generated = "false";

	// Default generation options ( database id )
	$scope.topicName = "Economics";
	$scope.formatKey = "paragraphs";
	$scope.outputKey = "html";
	$scope.quantity = 5;

	// Generate placeholder text on ng-click
	$scope.generate = function() {

		// Load text material from Wikipedia
	    var wikiDataPromise = wikipediaDataService.getData($scope.topicName);

	    // Leave a 'loading message' of some kind
		$scope.generated = "not-generated";
	    $scope.output = "Loading text from Wikipedia...";

	    // Wait for the data to arrive
	    wikiDataPromise.then(function(arrayOfStrings) {

			// And then format it according to the user's options
			arrayOfStrings = sanitiseArray 			( arrayOfStrings );
			arrayOfStrings = formatArray 			( arrayOfStrings, $scope.formatKey, $scope.outputKey );
			arrayOfStrings = outputArray 			( arrayOfStrings, $scope.formatKey, $scope.outputKey );
			var preparedString = getQuantityAsString( arrayOfStrings, $scope.quantity );

			// Finally replace the loading message with the output
			$scope.output = preparedString;
			$scope.generated = "generated";

			// Scroll view to the output
			$location.hash('results');
	        $anchorScroll();
	    });
	};

	$scope.getPlaceholder = function() {
		return $scope.output; // to ng-click
	}

	$scope.logPlaceholder = function() {
		// ng-click
	}

	$scope.saveToFile = function() {
		location.href = "data:application/octet-stream," + encodeURIComponent($scope.output);
	}
});

// Wikipedia Data Service, primary function getData(topicName) outputs a full article as an array of paragraphs.
app.factory('wikipediaDataService', function($http, $q) {

    var getData = function(request) {
        var deferred = $q.defer();

		$http.post('php/scraper.php', {"topic": request} )
		.success(function(data) {
            deferred.resolve(data);
		})
		.error(function(data) {
			deferred.resolve("Oops, couldn't find the data. Try again :)");
		});

        return deferred.promise;
    };
    return { getData: getData };
});

function sanitiseArray(array) {
	var sanitisedArray = [];

	array = array.filter(function(n){ return n != "undefined" });

	angular.forEach(array, function(string) {
		// Take each string, clean it up
		var sanitisedString = string.replace(/(\[[0-9]+\])/gim,'') // Remove [0] references - not working

		sanitisedArray.push(sanitisedString);
	});

	return sanitisedArray;
}

// Function to take paragraphs array and output accordingly.
function formatArray(sanitisedArray,format,output) {
	var formattedArray = [];

	angular.forEach(sanitisedArray, function(sanitisedString) {
		var formattedString;

		// Format each string
		if(format == "paragraphs") {
			// do feck all
			formattedString = sanitisedString.replace(/^(.{100}[^\s]*).*/gim, "$1")+"..."; // Max length.
			formattedString = sanitisedString;
		} else {
			// well then you have to chop each paragraph into single sentence strings
			var sentencesArray = sanitisedString.match( /[^\.!\?]+[\.!\?]+/g )

			angular.forEach(sentencesArray, function(sentence) {
				if(formattedString != "undefined") {
					formattedString = sentence;
				}
				formattedString = formattedString.replace(/^"/gim, ""); // remove "
			});

			// and then...
			if(format == "bulletpoints") {
				// trim the string to bulletpoint size
				if(formattedString != null) {
					formattedString = formattedString.replace(/^(.{30}[^\s]*).*/gim, "$1")+"..."; 
				}

				// and if it's not html then
				if(output != "html") {
					// additionally add some kinda bulletpoint formatting for plaintext
					formattedString = "* "+formattedString;
				}
			}
		}

		if(formattedString != "undefined") {
			// Add each string to sanitisedArray for return
			formattedArray.push(formattedString);
		}
	});

	return formattedArray;
}

function outputArray(formattedArray,format,output) {
	// Manipulate if HTML
	if(output == "html") {
		var readyArray = wrapInHTML(formattedArray,format);
	} else {
		var readyArray = formattedArray;
	}
	return readyArray;
}

// Function to wrap in HTML tags...
function wrapInHTML(arrayOfStrings,format) {
	var outputArray = [];

	if(format == "paragraphs" || format == "sentences") {
		// default to <p> paragraph
		angular.forEach(arrayOfStrings, function(string) {
			var htmlString = "<p>"+string+"</p>";
			outputArray.push(htmlString);
		});
	} else {
		// otherwise output <li> list
		angular.forEach(arrayOfStrings, function(string) {
			var htmlString = "<li>"+string+"</li>";
			outputArray.push(htmlString);
		});
	}

	return outputArray;
}

function getQuantityAsString(readyArray,quantity) {
	// Limit formattedArray by quantity
	var maximumOffset = readyArray.length - quantity - 1;
	var randomOffset = Math.floor(Math.random() * maximumOffset);
	var outputArray = readyArray.slice(randomOffset, randomOffset + quantity)

	// Return the formattedArray as a string with double line spacing
	var outputString = outputArray.join("\n\n");
	return outputString;
}