<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Services\OllamaService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DivisionAnalysisController extends Controller
{
    protected OllamaService $ollama;

    public function __construct(OllamaService $ollama)
    {
        $this->ollama = $ollama;
    }

    /**
     * Get AI analysis for a specific division
     */
    public function analyze(Request $request)
    {
        $validated = $request->validate([
            'district_id' => 'required|exists:districts,id',
            'division' => 'required|string',
        ]);

        // Check if Ollama is available
        if (!$this->ollama->isAvailable()) {
            \Log::warning('Ollama service not available', [
                'url' => config('services.ollama.url')
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'AI service is not available. Please ensure Ollama is running at ' . config('services.ollama.url')
            ], 503);
        }

        // Gather division statistics
        $stats = $this->getDivisionStats($validated['district_id'], $validated['division']);

        \Log::info('Division stats gathered', [
            'district_id' => $validated['district_id'],
            'division' => $validated['division'],
            'stats' => $stats
        ]);

        if ($stats['total_submissions'] === 0) {
            return response()->json([
                'success' => false,
                'error' => 'No data available for this division'
            ], 404);
        }

        // Get AI analysis
        $analysis = $this->ollama->analyzeDivisionData($stats);

        if (!$analysis) {
            \Log::error('Failed to generate analysis', [
                'stats' => $stats,
                'ollama_url' => config('services.ollama.url'),
                'ollama_model' => config('services.ollama.model')
            ]);
            
            return response()->json([
                'success' => false,
                'error' => 'Failed to generate analysis. Check logs for details.'
            ], 500);
        }

        \Log::info('Analysis generated successfully', [
            'division' => $validated['division'],
            'analysis_length' => strlen($analysis)
        ]);

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'analysis' => $analysis,
        ]);
    }

    /**
     * Get statistics for a division
     */
    protected function getDivisionStats(int $districtId, string $division): array
    {
        $submissions = Submission::with([
            'district',
            'teamSportsData',
            'swimmingData',
            'trackFieldData'
        ])
            ->where('district_id', $districtId)
            ->where('division', $division)
            ->get();

        $district = $submissions->first()?->district;

        $teamSportsCount = $submissions->sum(function ($sub) {
            return $sub->teamSportsData->count();
        });

        $swimmingCount = $submissions->sum(function ($sub) {
            return $sub->swimmingData->count();
        });

        $trackFieldCount = $submissions->sum(function ($sub) {
            return $sub->trackFieldData->count();
        });

        $maleParticipants = $submissions->sum(function ($sub) {
            return $sub->teamSportsData->sum('players_male') +
                   $sub->swimmingData->sum('players_male') +
                   $sub->trackFieldData->sum('players_male');
        });

        $femaleParticipants = $submissions->sum(function ($sub) {
            return $sub->teamSportsData->sum('players_female') +
                   $sub->swimmingData->sum('players_female') +
                   $sub->trackFieldData->sum('players_female');
        });

        return [
            'district_name' => $district?->name_en ?? 'Unknown',
            'division_name' => $division,
            'total_submissions' => $submissions->count(),
            'team_sports_count' => $teamSportsCount,
            'swimming_count' => $swimmingCount,
            'track_field_count' => $trackFieldCount,
            'total_participants' => $maleParticipants + $femaleParticipants,
            'male_participants' => $maleParticipants,
            'female_participants' => $femaleParticipants,
        ];
    }

    /**
     * Check Ollama service status
     */
    public function status()
    {
        $isAvailable = $this->ollama->isAvailable();
        $models = $isAvailable ? $this->ollama->getAvailableModels() : [];

        return response()->json([
            'available' => $isAvailable,
            'url' => config('services.ollama.url'),
            'configured_model' => config('services.ollama.model'),
            'available_models' => $models,
        ]);
    }
}
