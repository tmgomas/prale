<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * These divisions belong to "Urban Youth" district,
     * even though they appear inside "Colombo" in the JSON file.
     */
    private array $urbanYouthDivisions = [
        'Colombo',
        'Sri Jayawardanapura Kotte',
        'Thimbirigasyaya',
        'Dehiwala-Mount Lavinia',
        'Ratmalana',
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Pre-load all districts into a name => id map for performance
        $districtMap = District::all()->keyBy('name_en');

        $urbanYouthId = $districtMap['Urban Youth']->id ?? null;
        $colomboId    = $districtMap['Colombo']->id ?? null;

        if (!$urbanYouthId) {
            $this->command->error('Urban Youth district not found in DB. Run DistrictSeeder first.');
            return;
        }

        // Load JSON file
        $jsonPath = database_path('../district_division.json');
        $data     = json_decode(file_get_contents($jsonPath), true);

        $divisions = [];

        foreach ($data as $districtData) {
            $districtName = $districtData['en_US'];

            // Find district_id — skip if district not in DB
            if (!isset($districtMap[$districtName])) {
                $this->command->warn("District not found in DB: {$districtName} — skipping its divisions.");
                continue;
            }

            $defaultDistrictId = $districtMap[$districtName]->id;

            foreach ($districtData['divisions'] as $division) {
                $divisionName = $division['en_US'];

                // If this division belongs to Urban Youth — override district_id
                if ($districtName === 'Colombo' && in_array($divisionName, $this->urbanYouthDivisions)) {
                    $assignedDistrictId = $urbanYouthId;
                } else {
                    $assignedDistrictId = $defaultDistrictId;
                }

                $divisions[] = [
                    'district_id' => $assignedDistrictId,
                    'name_si'     => $division['si_LK'],
                    'name_ta'     => $division['ta_IN'],
                    'name_en'     => $divisionName,
                    'sort_order'  => $division['index'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }
        }

        // Insert in chunks for performance
        foreach (array_chunk($divisions, 50) as $chunk) {
            Division::insert($chunk);
        }

        $this->command->info('Divisions seeded successfully: ' . count($divisions) . ' records.');
    }
}
