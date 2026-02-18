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
        // Get existing sports and convert to array or collection we can modify
        $sports = Sport::orderBy('id')->get();
        
        // Define pseudo-sports for Swimming and Athletics
        $swimmingSport = new Sport([
            'name_en' => 'Swimming',
            'name_si' => 'පිහිනුම්',
            'code' => 'SW',
        ]);
        $swimmingSport->id = 9001; // Assign a unique ID outside normal range

        $athleticsSport = new Sport([
            'name_en' => 'Track & Field',
            'name_si' => 'මලල ක්‍රීඩා',
            'code' => 'TF',
        ]);
        $athleticsSport->id = 9002; // Assign a unique ID outside normal range

        // Append to the sports collection (we'll push to the collection)
        $sports->push($swimmingSport);
        $sports->push($athleticsSport);

        $selectedDistrictId = $request->input('district_id');
        $matrixData = [];

        if ($selectedDistrictId) {
            // Fetch submissions for the selected district with their team sports data
            $submissions = Submission::with(['teamSportsData', 'swimmingData', 'trackFieldData'])
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
                    $total = ($data->teams_male ?? 0) + ($data->teams_female ?? 0) + ($data->players_male ?? 0) + ($data->players_female ?? 0);
                    if ($total > 0) {
                        // Initialize if not set (though we did above, safety check)
                        if (!isset($matrixData[$divisionName][$data->sport_id])) {
                             $matrixData[$divisionName][$data->sport_id] = 0;
                        }
                        $matrixData[$divisionName][$data->sport_id] += $total;
                    }
                }

                // Check for Swimming Data
                if ($submission->swimmingData->isNotEmpty()) {
                     $swimmingTotal = $submission->swimmingData->sum(function ($data) {
                        return ($data->teams_male ?? 0) + ($data->teams_female ?? 0) + ($data->players_male ?? 0) + ($data->players_female ?? 0);
                    });
                    if ($swimmingTotal > 0) {
                        if (!isset($matrixData[$divisionName][9001])) {
                             $matrixData[$divisionName][9001] = 0;
                        }
                         $matrixData[$divisionName][9001] += $swimmingTotal;
                    }
                }

                // Check for Track & Field Data
                if ($submission->trackFieldData->isNotEmpty()) {
                    $athleticsTotal = $submission->trackFieldData->sum(function ($data) {
                        return ($data->teams_male ?? 0) + ($data->teams_female ?? 0) + ($data->players_male ?? 0) + ($data->players_female ?? 0);
                    });
                     if ($athleticsTotal > 0) {
                        if (!isset($matrixData[$divisionName][9002])) {
                             $matrixData[$divisionName][9002] = 0;
                        }
                        $matrixData[$divisionName][9002] += $athleticsTotal;
                    }
                }
            }

            // Sort divisions alphabetically
            ksort($matrixData);
        }

        return Inertia::render('Reports/SportsMatrix', [
            'districts' => $districts,
            'sports' => $sports, // This collection now includes Swimming and Athletics
            'selectedDistrictId' => $selectedDistrictId,
            'matrixData' => $matrixData,
        ]);
    }
}
