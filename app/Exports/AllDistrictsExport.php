<?php

namespace App\Exports;

use App\Models\District;
use App\Models\Sport;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class AllDistrictsExport implements WithMultipleSheets
{
    use Exportable;

    public function sheets(): array
    {
        $sheets = [];

        // Fetch all districts (sorted)
        $districts = District::orderBy('name_en')->get();
        
        // Fetch sports and add pseudo-sports once
        $sports = Sport::orderBy('id')->get();
        
        // Define pseudo-sports for Swimming and Athletics
        $swimmingSport = new Sport([
            'name_en' => 'Swimming',
            'name_si' => 'පිහිනුම්',
            'code' => 'SW',
        ]);
        $swimmingSport->id = 9001;

        $athleticsSport = new Sport([
            'name_en' => 'Track & Field',
            'name_si' => 'මලල ක්‍රීඩා',
            'code' => 'TF',
        ]);
        $athleticsSport->id = 9002;

        $sports->push($swimmingSport);
        $sports->push($athleticsSport);

        // Create a sheet for each district
        foreach ($districts as $district) {
            $sheets[] = new DistrictSheetExport($district, $sports);
        }

        return $sheets;
    }
}
