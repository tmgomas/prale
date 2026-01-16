<?php
// Simple test script to check Ollama connection
$url = 'http://localhost:11434/api/tags';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

header('Content-Type: application/json');

if ($error) {
    echo json_encode([
        'success' => false,
        'error' => $error,
        'message' => 'Failed to connect to Ollama'
    ]);
} else {
    echo json_encode([
        'success' => true,
        'http_code' => $httpCode,
        'response' => json_decode($response),
        'message' => 'Ollama is accessible'
    ]);
}
