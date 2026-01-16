<?php

use App\Http\Controllers\DivisionAnalysisController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Test Ollama connection
Route::get('/test-ollama', function () {
    try {
        $response = \Illuminate\Support\Facades\Http::timeout(5)
            ->get('http://localhost:11434/api/tags');
        
        return response()->json([
            'success' => $response->successful(),
            'status' => $response->status(),
            'data' => $response->json(),
            'message' => $response->successful() ? 'Ollama is accessible' : 'Ollama returned error'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'message' => 'Cannot connect to Ollama'
        ], 500);
    }
});

// AI Analysis routes (accessible to authenticated users via session)
Route::get('/division-analysis/status', [DivisionAnalysisController::class, 'status'])
    ->name('api.division-analysis.status');
    
Route::post('/division-analysis/analyze', [DivisionAnalysisController::class, 'analyze'])
    ->middleware('auth')
    ->name('api.division-analysis.analyze');

