'use strict';

var app = angular.module("lorem-ipsum", []);

app.controller('formController', function($scope, wikipediaDataService) {
	$scope.topics = [
		{ "name": "Science", 		"interpretAs": "" },
		{ "name": "Art",			"interpretAs": "" },
		{ "name": "Economics",		"interpretAs": "" },
		{ "name": "History",		"interpretAs": "" },
		{ "name": "Sport",			"interpretAs": "" },
	];

	$scope.formats = [
		{ "name": "Sentences", 		"interpretAs": "sentences" },
		{ "name": "Paragraphs", 	"interpretAs": "paragraphs" },
		{ "name": "Bullepoints", 	"interpretAs": "bulletpoints" },
	];

	$scope.outputs = [
		{ "name": "HTML tags", 		"interpretAs": "html" },
		{ "name": "plain text" , 	"interpretAs": "plaintext" },
		{ "name": "a text file", 	"interpretAs": "file" },
	];

	$scope.generated = "false";

	$scope.chosen = [];
	$scope.chosen.topic = $scope.topics[3].name;
	$scope.chosen.format = $scope.formats[1].name;
	$scope.chosen.output = $scope.outputs[1].name;

	$scope.generate = function() {

	    var wikiDataPromise = wikipediaDataService.getData($scope.chosen.topic);

	    $scope.output = "Loading text from Wikipedia...";
		$scope.generated = "false";

	    wikiDataPromise.then(function(data) {

			$scope.generated = "true";

			var paragraphs = data;
			
			var output = formatData(paragraphs,$scope.chosen.format);

			$scope.output = output;
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