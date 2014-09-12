<?php
require(dirname(__FILE__)."/php/config.php");

$app = new App();
$app->HTMLINJECT = 'ng-app="lorem-ipsum"';
$app->BODYINJECT = null;
$app->PAGETITLE = null;

$app->SCAFFOLD_HEAD();
?>
<main id="wrapper">

	<form ng-controller="formController" class="{{ generated }}">

	<div class="row">
		<h1><?=$app->PROJECTNAME?></h1>
	</div>

		<section id="option-topic" class="row option" ng-click="generated = false">
			<h2>Hey, shitforbrains, gimme placeholder text about...</h2>
			<label class="option" ng-repeat="topic in topics" >
				<input ng-model="$parent.chosen.topic" type="radio" name="topic" value="{{topic.name}}">
				{{topic.name}}
			</label>
			<div class="clearfix"></div>
			<h4>(Or specify your own topic)</h4>
			<input type="text" ng-model="$parent.chosen.topic" value="Biology" />
		</section>

		<section id="option-format" class="row option" ng-click="generated = false">
			<h2>An' I wannit {{ chosen.format }} long!</h2>
			<label class="option" ng-repeat="format in formats" >
				<input ng-model="$parent.chosen.format" type="radio" name="format" value="{{format.name}}">
				{{format.name}}
			</label>
		</section>

		<section id="option-output" class="row option" ng-click="generated = false">
			<h2>In {{ chosen.output }}, obviously.</h2>
			<label class="option" ng-repeat="output in outputs" >
				<input ng-model="$parent.chosen.output" type="radio" name="output" value="{{output.name}}">
				{{output.name}}
			</label>
		</section>

		<section id="generate" class="row" >
			<h4>Topic: {{ chosen.topic }}</h4>
			<h4>Format: {{ chosen.format }}</h4>
			<h4>Output: {{ chosen.output }}</h4>

			<button ng-click="generate()" scroll-on-click>Generate placeholder text!</button>

			<textarea ng-bind="output"></textarea>
		</section>

	</form>
	
</main>
<? $app->SCAFFOLD_FOOT() ?>