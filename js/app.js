'use strict';

var app = angular.module("lorem-ipsum", []);

app.controller('formController', function($scope, wikipediaDataService) {
	$scope.topics = [
		{ "name": "Science", },
		{ "name": "Art" },
		{ "name": "Economics" },
		{ "name": "History" },
		{ "name": "Sport" }
	];

	$scope.formats = [
		{ "name": "Sentences", },
		{ "name": "Paragraphs" },
		{ "name": "Bullepoints" }
	];

	$scope.generate = function() {

	    var wikiDataPromise = wikipediaDataService.getData($scope.chosen.topic);

	    $scope.output = "Loading text from Wikipedia...";

	    wikiDataPromise.then(function(data) {

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