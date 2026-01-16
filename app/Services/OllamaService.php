<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OllamaService
{
    protected string $baseUrl;
    protected string $model;

    public function __construct()
    {
        $this->baseUrl = config('services.ollama.url', 'http://localhost:11434');
        $this->model = config('services.ollama.model', 'llama2');
    }

    /**
     * Generate AI analysis for division data
     */
    public function analyzeDivisionData(array $divisionData): ?string
    {
        try {
            $prompt = $this->buildAnalysisPrompt($divisionData);

            Log::info('Sending request to Ollama', [
                'url' => "{$this->baseUrl}/api/generate",
                'model' => $this->model,
                'prompt_length' => strlen($prompt)
            ]);

            $response = Http::timeout(60)
                ->post("{$this->baseUrl}/api/generate", [
                    'model' => $this->model,
                    'prompt' => $prompt,
                    'stream' => false,
                ]);

            Log::info('Ollama response received', [
                'status' => $response->status(),
                'successful' => $response->successful(),
                'body_length' => strlen($response->body())
            ]);

            if ($response->successful()) {
                $result = $response->json('response');
                
                if (!$result) {
                    Log::error('Ollama returned empty response', [
                        'full_response' => $response->json()
                    ]);
                }
                
                return $result;
            }

            Log::error('Ollama API Error', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Ollama Service Exception', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return null;
        }
    }

    /**
     * Build analysis prompt from division data
     */
    protected function buildAnalysisPrompt(array $data): string
    {
        $district = $data['district_name'] ?? 'Unknown District';
        $division = $data['division_name'] ?? 'Unknown Division';
        $totalSubmissions = $data['total_submissions'] ?? 0;
        $teamSports = $data['team_sports_count'] ?? 0;
        $swimming = $data['swimming_count'] ?? 0;
        $trackField = $data['track_field_count'] ?? 0;
        $totalParticipants = $data['total_participants'] ?? 0;
        $maleParticipants = $data['male_participants'] ?? 0;
        $femaleParticipants = $data['female_participants'] ?? 0;

        return <<<PROMPT
You are a sports data analyst for the 35th National Youth Sports Festival 2025 in Sri Lanka.

Analyze the following data for {$division}, {$district}:

**Submission Statistics:**
- Total Submissions: {$totalSubmissions}
- Team Sports Events: {$teamSports}
- Swimming Events: {$swimming}
- Track & Field Events: {$trackField}

**Participation:**
- Total Participants: {$totalParticipants}
- Male Participants: {$maleParticipants}
- Female Participants: {$femaleParticipants}

Provide a brief analysis (3-4 sentences) covering:
1. Overall participation level
2. Gender balance
3. Sport category distribution
4. One actionable recommendation

Keep the response concise and professional.
PROMPT;
    }

    /**
     * Check if Ollama service is available
     */
    public function isAvailable(): bool
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/tags");
            return $response->successful();
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get available models
     */
    public function getAvailableModels(): array
    {
        try {
            $response = Http::timeout(5)->get("{$this->baseUrl}/api/tags");
            
            if ($response->successful()) {
                return collect($response->json('models', []))
                    ->pluck('name')
                    ->toArray();
            }

            return [];
        } catch (\Exception $e) {
            return [];
        }
    }
}
