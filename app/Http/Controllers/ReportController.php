<?php

namespace App\Http\Controllers;

use App\Models\District;
use App\Models\Sport;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the sports participation matrix report.
     */
    public function sportsMatrix(Request $request)
    {
        $districts = District::orderBy('name_en')->get();
        $sports = Sport::orderBy('id')->get(); // Or order by code/name

        $selectedDistrictId = $request->input('district_id');
        $matrixData = [];

        if ($selectedDistrictId) {
            // Fetch submissions for the selected district with their team sports data
            $submissions = Submission::with('teamSportsData')
                ->where('district_id', $selectedDistrictId)
                ->where('status', '!=', 'draft') // Optional: Exclude drafts if needed
                ->get();

            foreach ($submissions as $submission) {
                // Determine the division name. 
                // Assuming 'division' column stores the DS Division name.
                $divisionName = $submission->division;
                
                if (!$divisionName) {
                    continue;
                }

                if (!isset($matrixData[$divisionName])) {
                    $matrixData[$divisionName] = [];
                }

                // Get the IDs of sports that have data in this submission
                foreach ($submission->teamSportsData as $data) {
                    if ($data->teams_male > 0 || $data->teams_female > 0 || $data->players_male > 0 || $data->players_female > 0) {
                        $matrixData[$divisionName][$data->sport_id] = true;
                    }
                }
            }

            // Sort divisions alphabetically
            ksort($matrixData);
        }

        return Inertia::render('Reports/SportsMatrix', [
            'districts' => $districts,
            'sports' => $sports,
            'selectedDistrictId' => $selectedDistrictId,
            'matrixData' => $matrixData,
        ]);
    }
}
