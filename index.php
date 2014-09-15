<?php
require(dirname(__FILE__)."/php/config.php");

$app = new App();
$app->HTMLINJECT = 'ng-app="lorem-ipsum"';
$app->BODYINJECT = null;
$app->PAGETITLE = null;

$app->SCAFFOLD_HEAD();
?>
<main id="wrapper" ng-controller="formController" class="{{ generated }}">

	<div class="row">
		<h1><?=$app->PROJECTNAME?></h1>
	</div>

	<div id="form" ng-click="generated = false">
		<section id="option-topic" class="row option">
			<h2>Hey, shitforbrains, gimme placeholder text about...</h2>

			<label ng-repeat="topic in db.topics" class="option column small-4">
				<input ng-model="$parent.topicName" type="radio" name="topic" value="{{ topic }}">
				{{ topic }}
			</label>

			<div id="specify-topic" class="column small-12">
				<input type="text" ng-model="topicName" placeholder="(Or specify your own topic)"/>
			</div>
		</section>

		<section id="option-format" class="row option">
			<h2>An' I wannit in
				<input type='number' name="quantity" ng-model='quantity' ng-class="{doubledigits: (quantity > 9)}" step="1" min="1" max="20" />
				{{ db.formats[formatKey].echo }}!
			</h2>

			<label ng-repeat="format in db.formats" class="option column small-3">
				<input ng-model="$parent.formatKey" type="radio" name="format" value="{{ format.key }}">
				{{ format.name }}
			</label>

		</section>

		<section id="option-output" class="row option">
			<h2>In {{ db.outputs[outputKey].echo }}, obviously.</h2>

			<label ng-repeat="output in db.outputs" class="option column small-4">
				<input ng-model="$parent.outputKey" type="radio" name="output" value="{{output.key }}">
				{{ output.name }}
			</label>
		</section>
	</div>

	<section id="generate" class="row">
		<h4 class="small-4 column">Topic: {{ topicName }}</h4>
		<h4 class="small-4 column">Format: {{ db.formats[formatKey].name }}</h4>
		<h4 class="small-4 column">Output: {{ db.outputs[outputKey].name }}</h4>

		<button class="small-12" id="button-generate" ng-click="generate()" scroll-on-click>Generate placeholder text!</button>
		<button class="small-6" id="button-save-clipboard" clip-copy="getPlaceholder()" clip-click="logPlaceholder()">Copy to clipboard</button>
		<button class="small-6" id="button-save-file" ng-click="saveToFile()">Save to file</button>

		<textarea id="results" ng-bind="output"></textarea>
	</section>
	
</main>
<? $app->SCAFFOLD_FOOT() ?>