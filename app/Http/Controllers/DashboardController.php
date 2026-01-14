<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Overall Summary Stats
        $totalSubmissions = Submission::count();
        $totalDistrictsWithData = Submission::distinct('district_id')->count();
        $totalDivisionsWithData = DB::table('submissions')
            ->select('district_id', 'division')
            ->distinct()
            ->get()
            ->count();

        // 2. Stats per District (for the main list)
        // detailed breakdown of submissions by district and division
        $districtStats = District::select('id', 'name_en', 'name_si')
            ->withCount('submissions')
            ->get()
            ->map(function ($district) {
                // Get division breakdown for this district
                $breakdown = Submission::where('district_id', $district->id)
                    ->select('division', DB::raw('count(*) as count'))
                    ->groupBy('division')
                    ->orderBy('count', 'desc')
                    ->get();

                
                $data = $district->toArray();
                $data['division_breakdown'] = $breakdown;
                return $data;
            });
            
        // Sort by submission count desc
        $districtStats = $districtStats->sortByDesc('submissions_count')->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_submissions' => $totalSubmissions,
                'districts_active' => $totalDistrictsWithData,
                'divisions_active' => $totalDivisionsWithData,
            ],
            'district_stats' => $districtStats,
        ]);
    }
}
