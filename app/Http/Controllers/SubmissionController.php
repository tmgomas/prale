<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\FinancialData;
use App\Models\Sport;
use App\Models\Submission;
use App\Models\SwimmingData;
use App\Models\TeamSportData;
use App\Models\TrackFieldData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class SubmissionController extends Controller
{
    /**
     * Display a listing of submissions
     */
    public function index(): Response
    {
        $submissions = Submission::with(['district', 'user'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
        ]);
    }

    /**
     * Show the form for creating a new submission
     */
    public function create(): Response
    {
        $districts = District::orderBy('name_si')->get();
        $sports = Sport::orderBy('code')->get();

        return Inertia::render('Submissions/Create', [
            'districts' => $districts,
            'sports' => $sports,
        ]);
    }

    /**
     * Store a newly created submission
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Step 1 & 2: Basic Information
            'district_id' => 'required|exists:districts,id',
            'division' => 'required|string|max:255',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required|in:AD,DYO,YSO,AYSO',
            'epf_number' => 'required|string|max:50',
            'status' => 'nullable|in:draft,submitted',

            // Step 3: Team Sports Data
            'team_sports' => 'nullable|array',
            'team_sports.*.sport_id' => 'required|exists:sports,id',
            'team_sports.*.event_date' => 'nullable|date',
            'team_sports.*.venue' => 'nullable|string|max:255',
            'team_sports.*.teams_male' => 'nullable|integer|min:0',
            'team_sports.*.teams_female' => 'nullable|integer|min:0',
            'team_sports.*.players_male' => 'nullable|integer|min:0',
            'team_sports.*.players_female' => 'nullable|integer|min:0',

            // Swimming Data
            'swimming' => 'nullable|array',
            'swimming.*.event_date' => 'nullable|date',
            'swimming.*.venue' => 'nullable|string|max:255',
            'swimming.*.teams_male' => 'nullable|integer|min:0',
            'swimming.*.teams_female' => 'nullable|integer|min:0',
            'swimming.*.players_male' => 'nullable|integer|min:0',
            'swimming.*.players_female' => 'nullable|integer|min:0',

            // Track & Field Data
            'track_field' => 'nullable|array',
            'track_field.*.event_date' => 'nullable|date',
            'track_field.*.venue' => 'nullable|string|max:255',
            'track_field.*.teams_male' => 'nullable|integer|min:0',
            'track_field.*.teams_female' => 'nullable|integer|min:0',
            'track_field.*.players_male' => 'nullable|integer|min:0',
            'track_field.*.players_female' => 'nullable|integer|min:0',

            // Step 4: Financial Data
            'financial.income_head_office' => 'nullable|numeric|min:0',
            'financial.income_external_sources' => 'nullable|numeric|min:0',
            'financial.expense_team_sports' => 'nullable|numeric|min:0',
            'financial.expense_track_field' => 'nullable|numeric|min:0',
        ]);


        return DB::transaction(function () use ($validated) {
            // Create submission
            $submission = Submission::create([
                'district_id' => $validated['district_id'],
                'division' => $validated['division'],
                'officer_name' => $validated['officer_name'],
                'designation' => $validated['designation'],
                'epf_number' => $validated['epf_number'],
                'status' => $validated['status'] ?? 'draft',
                'user_id' => auth()->id(),
            ]);

            // Mark as submitted if status is submitted
            if (($validated['status'] ?? 'draft') === 'submitted') {
                $submission->markAsSubmitted();
            }

            // Save team sports data
            if (!empty($validated['team_sports'])) {
                foreach ($validated['team_sports'] as $teamSport) {
                    $submission->teamSportsData()->create($teamSport);
                }
            }

            // Save swimming data
            if (!empty($validated['swimming'])) {
                foreach ($validated['swimming'] as $swimming) {
                    $submission->swimmingData()->create($swimming);
                }
            }

            // Save track & field data
            if (!empty($validated['track_field'])) {
                foreach ($validated['track_field'] as $trackField) {
                    $submission->trackFieldData()->create($trackField);
                }
            }

            // Save financial data
            if (!empty($validated['financial'])) {
                $submission->financialData()->create([
                    'income_head_office' => $validated['financial']['income_head_office'] ?? 0,
                    'income_external_sources' => $validated['financial']['income_external_sources'] ?? 0,
                    'expense_team_sports' => $validated['financial']['expense_team_sports'] ?? 0,
                    'expense_track_field' => $validated['financial']['expense_track_field'] ?? 0,
                ]);
            }

            return redirect()->route('submissions.show', $submission)
                ->with('success', 'ඉදිරිපත් කිරීම සාර්ථකව සුරකින ලදී');
        });
    }

    /**
     * Display the success page
     */
    public function success(): Response
    {
        return Inertia::render('Submissions/Success');
    }

    /**
     * Display the specified submission
     */
    public function show(Submission $submission): Response
    {
        $submission->load([
            'district',
            'user',
            'teamSportsData.sport',
            'swimmingData',
            'trackFieldData',
            'financialData',
        ]);

        return Inertia::render('Submissions/Show', [
            'submission' => $submission,
        ]);
    }

    /**
     * Show the form for editing the specified submission
     */
    public function edit(Submission $submission): Response
    {
        $submission->load([
            'teamSportsData',
            'swimmingData',
            'trackFieldData',
            'financialData',
        ]);

        $districts = District::orderBy('name_si')->get();
        $sports = Sport::orderBy('code')->get();

        return Inertia::render('Submissions/Edit', [
            'submission' => $submission,
            'districts' => $districts,
            'sports' => $sports,
        ]);
    }

    /**
     * Update the specified submission
     */
    public function update(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            // Step 1 & 2: Basic Information
            'district_id' => 'required|exists:districts,id',
            'division' => 'required|string|max:255',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required|in:AD,DYO,YSO,AYSO',
            'epf_number' => 'required|string|max:50',
            'status' => 'nullable|in:draft,submitted',

            // Step 3: Team Sports Data
            'team_sports' => 'nullable|array',
            'team_sports.*.sport_id' => 'required|exists:sports,id',
            'team_sports.*.event_date' => 'nullable|date',
            'team_sports.*.venue' => 'nullable|string|max:255',
            'team_sports.*.teams_male' => 'nullable|integer|min:0',
            'team_sports.*.teams_female' => 'nullable|integer|min:0',
            'team_sports.*.players_male' => 'nullable|integer|min:0',
            'team_sports.*.players_female' => 'nullable|integer|min:0',

            // Swimming Data
            'swimming' => 'nullable|array',
            'swimming.*.event_date' => 'nullable|date',
            'swimming.*.venue' => 'nullable|string|max:255',
            'swimming.*.teams_male' => 'nullable|integer|min:0',
            'swimming.*.teams_female' => 'nullable|integer|min:0',
            'swimming.*.players_male' => 'nullable|integer|min:0',
            'swimming.*.players_female' => 'nullable|integer|min:0',

            // Track & Field Data
            'track_field' => 'nullable|array',
            'track_field.*.event_date' => 'nullable|date',
            'track_field.*.venue' => 'nullable|string|max:255',
            'track_field.*.teams_male' => 'nullable|integer|min:0',
            'track_field.*.teams_female' => 'nullable|integer|min:0',
            'track_field.*.players_male' => 'nullable|integer|min:0',
            'track_field.*.players_female' => 'nullable|integer|min:0',

            // Step 4: Financial Data
            'financial.income_head_office' => 'nullable|numeric|min:0',
            'financial.income_external_sources' => 'nullable|numeric|min:0',
            'financial.expense_team_sports' => 'nullable|numeric|min:0',
            'financial.expense_track_field' => 'nullable|numeric|min:0',
        ]);


        return DB::transaction(function () use ($validated, $submission) {
            // Update submission
            $submission->update([
                'district_id' => $validated['district_id'],
                'division' => $validated['division'],
                'officer_name' => $validated['officer_name'],
                'designation' => $validated['designation'],
                'epf_number' => $validated['epf_number'],
                'status' => $validated['status'] ?? 'draft',
            ]);

            // Mark as submitted if status changed to submitted
            if (($validated['status'] ?? 'draft') === 'submitted' && $submission->isDraft()) {
                $submission->markAsSubmitted();
            }

            // Delete existing related data
            $submission->teamSportsData()->delete();
            $submission->swimmingData()->delete();
            $submission->trackFieldData()->delete();
            $submission->financialData()->delete();

            // Save team sports data
            if (!empty($validated['team_sports'])) {
                foreach ($validated['team_sports'] as $teamSport) {
                    $submission->teamSportsData()->create($teamSport);
                }
            }

            // Save swimming data
            if (!empty($validated['swimming'])) {
                foreach ($validated['swimming'] as $swimming) {
                    $submission->swimmingData()->create($swimming);
                }
            }

            // Save track & field data
            if (!empty($validated['track_field'])) {
                foreach ($validated['track_field'] as $trackField) {
                    $submission->trackFieldData()->create($trackField);
                }
            }

            // Save financial data
            if (!empty($validated['financial'])) {
                $submission->financialData()->create([
                    'income_head_office' => $validated['financial']['income_head_office'] ?? 0,
                    'income_external_sources' => $validated['financial']['income_external_sources'] ?? 0,
                    'expense_team_sports' => $validated['financial']['expense_team_sports'] ?? 0,
                    'expense_track_field' => $validated['financial']['expense_track_field'] ?? 0,
                ]);
            }

            return redirect()->route('submissions.show', $submission)
                ->with('success', 'ඉදිරිපත් කිරීම සාර්ථකව යාවත්කාලීන කරන ලදී');
        });
    }

    /**
     * Remove the specified submission
     */
    public function destroy(Submission $submission)
    {
        $submission->delete();

        return redirect()->route('submissions.index')
            ->with('success', 'ඉදිරිපත් කිරීම සාර්ථකව මකා දමන ලදී');
    }
}
