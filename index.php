<?php
require(dirname(__FILE__)."/php/config.php");

$app = new App();
$app->HTMLINJECT = 'ng-app="lorem-ipsum"';
$app->BODYINJECT = null;
$app->PAGETITLE = null;

$app->SCAFFOLD_HEAD();
?>
<main id="wrapper">

	<div class="row">
		<h1><?=$app->PROJECTNAME?></h1>
	</div>

	<form ng-controller="formController">

		<section class="row">
			<h2>Hey, gimme placeholder text about...</h2>
			<label class="option" ng-repeat="topic in topics" >
				<input ng-model="$parent.chosen.topic" type="radio" name="topic" value="{{topic.name}}">
				{{topic.name}}
			</label>
			<h3>(Or specify your own topic)</h3>
			<input type="text" ng-model="$parent.chosen.topic" value="Biology" />
		</section>

		<section class="row">
			<h2>How long?</h2>
			<label class="option" ng-repeat="format in formats" >
				<input ng-model="$parent.chosen.format" type="radio" name="format" value="{{format.name}}">
				{{format.name}}
			</label>
		</section>

		<section class="row">
			<h4>Topic: {{ chosen.topic }}</h4>
			<h4>Format: {{ chosen.format }}</h4>

			<input type="button" ng-click="generate()" value="Generate placeholder text!" />
			<textarea>
				{{ output }}
			</textarea>
			<input type="button" value="Save .txt file" />
			<input type="button" value="Copy to clipboard" />
		</section>

	</form>
	
</main>
<? $app->SCAFFOLD_FOOT() ?>