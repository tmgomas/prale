<?php

namespace App\Http\Controllers;

use App\Exports\AllDistrictsExport;
use App\Models\District;
use App\Models\Sport;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    /**
     * Export all districts matrix to Excel.
     */
    public function exportSportsMatrix()
    {
        set_time_limit(300); // 5 minutes
        ini_set('memory_limit', '512M');

        return Excel::download(new AllDistrictsExport, 'sports-matrix-all-districts.xlsx');
    }
    /**
     * Display the sports participation matrix report.
     */
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
        $matrixData = self::getMatrixData($selectedDistrictId);

        return Inertia::render('Reports/SportsMatrix', [
            'districts' => $districts,
            'sports' => $sports, // This collection now includes Swimming and Athletics
            'selectedDistrictId' => $selectedDistrictId,
            'matrixData' => $matrixData,
        ]);
    }

    /**
     * Calculate matrix data for a specific district.
     */
    public static function getMatrixData($districtId)
    {
        if (!$districtId) {
            return [];
        }

        $matrixData = [];

        // Fetch submissions for the selected district with their team sports data
        // Fetch the latest submission ID for each division in the selected district
        $latestSubmissionIds = Submission::query()
            ->selectRaw('MAX(id) as id')
            ->where('district_id', $districtId)
            ->where('status', '!=', 'draft') // Exclude drafts
            ->groupBy('division')
            ->get()
            ->pluck('id');

        // Fetch full submission data for the identified latest submissions
        $submissions = Submission::with(['teamSportsData', 'swimmingData', 'trackFieldData'])
            ->whereIn('id', $latestSubmissionIds)
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
                $hasData = ($data->teams_male ?? 0) + ($data->players_male ?? 0) + ($data->teams_female ?? 0) + ($data->players_female ?? 0) > 0;
                
                if ($hasData) {
                    if (!isset($matrixData[$divisionName][$data->sport_id])) {
                            $matrixData[$divisionName][$data->sport_id] = [
                                'men_teams' => 0,
                                'men_participants' => 0,
                                'women_teams' => 0,
                                'women_participants' => 0
                            ];
                    }
                    $matrixData[$divisionName][$data->sport_id]['men_teams'] += ($data->teams_male ?? 0);
                    $matrixData[$divisionName][$data->sport_id]['men_participants'] += ($data->players_male ?? 0);
                    $matrixData[$divisionName][$data->sport_id]['women_teams'] += ($data->teams_female ?? 0);
                    $matrixData[$divisionName][$data->sport_id]['women_participants'] += ($data->players_female ?? 0);
                }
            }

            // Check for Swimming Data
            if ($submission->swimmingData->isNotEmpty()) {
                    $swimMenTeams = $submission->swimmingData->sum('teams_male');
                    $swimMenPlayers = $submission->swimmingData->sum('players_male');
                    $swimWomenTeams = $submission->swimmingData->sum('teams_female');
                    $swimWomenPlayers = $submission->swimmingData->sum('players_female');

                if (($swimMenTeams + $swimMenPlayers + $swimWomenTeams + $swimWomenPlayers) > 0) {
                    if (!isset($matrixData[$divisionName][9001])) {
                            $matrixData[$divisionName][9001] = [
                                'men_teams' => 0,
                                'men_participants' => 0,
                                'women_teams' => 0,
                                'women_participants' => 0
                            ];
                    }
                        $matrixData[$divisionName][9001]['men_teams'] += $swimMenTeams;
                        $matrixData[$divisionName][9001]['men_participants'] += $swimMenPlayers;
                        $matrixData[$divisionName][9001]['women_teams'] += $swimWomenTeams;
                        $matrixData[$divisionName][9001]['women_participants'] += $swimWomenPlayers;
                }
            }

            // Check for Track & Field Data
            if ($submission->trackFieldData->isNotEmpty()) {
                    $trackMenTeams = $submission->trackFieldData->sum('teams_male');
                    $trackMenPlayers = $submission->trackFieldData->sum('players_male');
                    $trackWomenTeams = $submission->trackFieldData->sum('teams_female');
                    $trackWomenPlayers = $submission->trackFieldData->sum('players_female');
                
                    if (($trackMenTeams + $trackMenPlayers + $trackWomenTeams + $trackWomenPlayers) > 0) {
                    if (!isset($matrixData[$divisionName][9002])) {
                            $matrixData[$divisionName][9002] = [
                                'men_teams' => 0,
                                'men_participants' => 0,
                                'women_teams' => 0,
                                'women_participants' => 0
                            ];
                    }
                    $matrixData[$divisionName][9002]['men_teams'] += $trackMenTeams;
                    $matrixData[$divisionName][9002]['men_participants'] += $trackMenPlayers;
                    $matrixData[$divisionName][9002]['women_teams'] += $trackWomenTeams;
                    $matrixData[$divisionName][9002]['women_participants'] += $trackWomenPlayers;
                }
            }
        }

        // Sort divisions alphabetically
        ksort($matrixData);

        return $matrixData;
    }
}
