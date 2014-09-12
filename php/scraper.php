<?php

$request = json_decode(file_get_contents("php://input"));

$wikipage = grabFromWikipedia($request->topic);

$paragraphs = interpretAsPlainText($wikipage);

$json = json_encode($paragraphs);

echo $json;

function grabFromWikipedia($topic) {
  $wikipage = file_get_contents("http://en.m.wikipedia.org/wiki/".$topic);
  return $wikipage;
}

function interpretAsPlainText($wikipage) {
  $doc = new DOMDocument();
  $doc->loadHTML($wikipage);
  $p = $doc->getElementById('content')->getElementsByTagName('p');
  foreach($p as $paragraph) {
  	$return[] = $paragraph->textContent;
  }
  return $return;
}