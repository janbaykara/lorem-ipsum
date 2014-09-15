'use strict';

var app = angular.module("lorem-ipsum", []);

app.controller('formController', function($scope, wikipediaDataService, $location, $anchorScroll) {

	// Data model
	$scope.db = {
		"topics": 			[ "Science", "Art", "Economics", "History", "Sport"], // # To illustrate
		"formats": {
			"sentences": 	{ "key": "sentences", 		"name": "Sentences", 	 	"echo": "in sentences", },
			"paragraphs": 	{ "key": "paragraphs", 		"name": "Paragraphs", 	 	"echo": "long-winded",  },
			"bulletpoints": { "key": "bulletpoints", 	"name": "Bullet points", 	"echo": "snappy", 		},
		}, 
		"outputs": {	 
			"html": 		{ "key": "html",			"name": "HTML tags", 		"echo": "HTML tags", 	},
			"plaintext": 	{ "key": "plaintext",		"name": "Plain text", 		"echo": "plain text" ,  },
			"textfile": 	{ "key": "textfile",		"name": ".txt file", 		"echo": "a text file",  },
		}
	}

	$scope.generated = "false";


	// Default generation options ( database id )
	$scope.topicName = "Economics";
	$scope.formatKey = "paragraphs";
	$scope.outputKey = "html";
	$scope.quantity = 5;
	$scope.generate = function() {

		// Load text material from Wikipedia
	    var wikiDataPromise = wikipediaDataService.getData($scope.topicName);

	    $scope.output = "Loading text from Wikipedia...";
		$scope.generated = "false";

	    wikiDataPromise.then(function(data) {

			$scope.generated = "true";

			var paragraphs = data;
			
			var output = formatData(paragraphs,$scope.chosen.format);

			$scope.output = output;
			// Scroll view to the output
			$location.hash('results');
	        $anchorScroll();
	    });

	};
})

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

function formatData(paragraphs,format) {
	var output = "";
	paragraphs.splice(0, 1);
	angular.forEach(paragraphs, function(p) {
		// Remove Wikipedia formatting
			var sanitisedOutput = p
					.replace("/\[[0-9]+\]/",'');

		// PARAGRAPHS
			if(format == "Paragraphs") {
				sanitisedOutput
					.trim()
					.replace("\t",'')
			} else
		// SENTENCES
			if(format == "Sentences") {
				sanitisedOutput
					.replace(".",".\n\n");
			} else
		// BULLETPOINTS
			if(format == "Bulletpoints") {
				sanitisedOutput
					.replace(".","</li>\n\n<li>");
			}

		output += sanitisedOutput+"\n\n";
	});

	return output;
}