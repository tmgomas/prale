<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$subs = App\Models\Submission::with('divisionData')->limit(2)->get();
echo json_encode($subs->map(function($s) {
    return ['id' => $s->id, 'div' => $s->division, 'rel' => $s->divisionData];
}));
