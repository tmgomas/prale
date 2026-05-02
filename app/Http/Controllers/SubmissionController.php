<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Division;
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
use Illuminate\Support\Facades\RateLimiter;

class SubmissionController extends Controller
{
    /**
     * Display a listing of submissions
     */
    public function index(Request $request): Response
    {
        $query = Submission::with(['district', 'divisionData', 'user'])
            ->latest();

        if ($request->filled('district_id')) {
            $query->where('district_id', $request->input('district_id'));
        }

        if ($request->filled('division')) {
            $divisionSearch = $request->input('division');
            $query->where(function($q) use ($divisionSearch) {
                $q->whereHas('divisionData', function($q2) use ($divisionSearch) {
                    $q2->where('name_en', 'like', "%{$divisionSearch}%")
                       ->orWhere('name_si', 'like', "%{$divisionSearch}%");
                })->orWhere('division', 'like', "%{$divisionSearch}%");
            });
        }

        $submissions = $query->paginate(15)
            ->withQueryString();

        return Inertia::render('Submissions/Index', [
            'submissions' => $submissions,
            'filters' => $request->only(['district_id', 'division']),
        ]);
    }

    /**
     * Export submissions as PDF
     */
    public function export(Request $request)
    {
        $query = Submission::with([
            'district',
            'divisionData',
            'teamSportsData.sport',
            'swimmingData',
            'trackFieldData',
            'financialData'
        ])->latest();

        if ($request->filled('district_id')) {
            $query->where('district_id', $request->input('district_id'));
        }

        if ($request->filled('division')) {
            $divisionSearch = $request->input('division');
            $query->where(function($q) use ($divisionSearch) {
                $q->whereHas('divisionData', function($q2) use ($divisionSearch) {
                    $q2->where('name_en', 'like', "%{$divisionSearch}%")
                       ->orWhere('name_si', 'like', "%{$divisionSearch}%");
                })->orWhere('division', 'like', "%{$divisionSearch}%");
            });
        }

        $submissions = $query->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.submissions', ['submissions' => $submissions]);
        $pdf->setPaper('a4', 'portrait');

        return $pdf->download('submissions-export-' . now()->format('Y-m-d-His') . '.pdf');
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
            'sports'    => $sports,
        ]);
    }

    /**
     * Return divisions for a given district (JSON API)
     */
    public function getDivisions(Request $request)
    {
        $request->validate(['district_id' => 'required|exists:districts,id']);

        $divisions = Division::where('district_id', $request->district_id)
            ->orderBy('sort_order')
            ->get(['id', 'name_si', 'name_en']);

        return response()->json($divisions);
    }

    /**
     * Store a newly created submission
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Step 1 & 2: Basic Information
            'district_id'     => 'required|exists:districts,id',
            'submission_type' => 'required|in:district,division',
            'division_id'     => 'nullable|exists:divisions,id',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required|in:AD,DYO,YSO,AYSO',
            'epf_number' => 'required|string|max:50|unique:submissions,epf_number',
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
        ], [
            'epf_number.unique' => 'මෙම EPF අංකයෙන් දැනටමත් දත්ත ඇතුළත් කර ඇත. කරුණාකර වෙනස් අංකයක් ඇතුළත් කරන්න හෝ පවතින දත්ත සංස්කරණය කරන්න.',
        ]);


        return DB::transaction(function () use ($validated) {
            // Create submission
            $submission = Submission::create([
                'district_id' => $validated['district_id'],
                'division'    => $validated['division_id'],
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

            if (!auth()->check()) {
                return redirect()->route('submissions.success');
            }

            return redirect()->route('submissions.show', $submission)
                ->with('success', 'ඉදිරිපත් කිරීම සාර්ථකව සුරකින ලදී');
        });
    }

    /**
     * Show the public lookup form (EPF + District)
     */
    public function lookup(): Response
    {
        $districts = District::orderBy('name_si')->get(['id', 'name_si', 'name_en']);

        return Inertia::render('Submissions/Lookup', [
            'districts' => $districts,
        ]);
    }

    /**
     * Process EPF + District lookup and redirect to public edit page
     */
    public function lookupFind(Request $request)
    {
        // Rate limit: 5 attempts per 10 minutes per IP
        $key = 'submission-lookup:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return back()->withErrors([
                'epf_number' => "ඉතා වැඩිවාරයක් උත්සාහ කළා. තත්පර {$seconds} කින් නැවත උත්සාහ කරන්න.",
            ]);
        }

        $request->validate([
            'epf_number'  => 'required|string|max:50',
            'district_id' => 'required|exists:districts,id',
        ]);

        $submission = Submission::where('epf_number', trim($request->epf_number))
            ->where('district_id', $request->district_id)
            ->latest()
            ->first();

        if (!$submission) {
            RateLimiter::hit($key, 600); // count failed attempt, expire in 10 min

            return back()->withErrors([
                'epf_number' => 'EPF අංකය හෝ දිස්ත්‍රික්කය නිවැරදි නොවේ. නැවත පරීක්ෂා කරන්න.',
            ]);
        }

        // Success — clear rate limit
        RateLimiter::clear($key);

        return redirect()->route('submissions.public-edit', $submission->id);
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
            'divisionData',
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
     * Show the form for editing the specified submission (auth protected)
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
            'districts'  => $districts,
            'sports'     => $sports,
        ]);
    }

    /**
     * Show the public edit form (no auth — accessed via EPF+District lookup)
     */
    public function publicEdit(Submission $submission): Response
    {
        $submission->load([
            'teamSportsData.sport',
            'swimmingData',
            'trackFieldData',
            'financialData',
        ]);

        $districts = District::orderBy('name_si')->get();
        $sports    = Sport::orderBy('code')->get();

        return Inertia::render('Submissions/PublicEdit', [
            'submission' => $submission,
            'districts'  => $districts,
            'sports'     => $sports,
        ]);
    }

    /**
     * Update the specified submission
     */
    public function update(Request $request, Submission $submission)
    {
        $validated = $request->validate([
            // Step 1 & 2: Basic Information
            'district_id'     => 'required|exists:districts,id',
            'submission_type' => 'required|in:district,division',
            'division_id'     => 'nullable|exists:divisions,id',
            'officer_name' => 'required|string|max:255',
            'designation' => 'required|in:AD,DYO,YSO,AYSO',
            'epf_number' => 'required|string|max:50|unique:submissions,epf_number,' . $submission->id,
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
        ], [
            'epf_number.unique' => 'මෙම EPF අංකයෙන් දැනටමත් දත්ත ඇතුළත් කර ඇත. කරුණාකර වෙනස් අංකයක් ඇතුළත් කරන්න.',
        ]);


        return DB::transaction(function () use ($validated, $submission) {
            // Update submission
            $submission->update([
                'district_id' => $validated['district_id'],
                'division'    => $validated['division_id'],
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
