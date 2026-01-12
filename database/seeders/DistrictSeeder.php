<?php

namespace Database\Seeders;

use App\Models\District;
use Illuminate\Database\Seeder;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $districts = [
            ['name_si' => 'නාගරික තරුණයා', 'name_en' => 'Urban youth'],
            ['name_si' => 'කොළඹ', 'name_en' => 'Colombo'],
            ['name_si' => 'ගම්පහ', 'name_en' => 'Gampaha'],
            ['name_si' => 'කළුතර', 'name_en' => 'Kalutara'],
            ['name_si' => 'මහනුවර', 'name_en' => 'Kandy'],
            ['name_si' => 'මාතලේ', 'name_en' => 'Matale'],
            ['name_si' => 'නුවරඑළිය', 'name_en' => 'Nuwara Eliya'],
            ['name_si' => 'ගාල්ල', 'name_en' => 'Galle'],
            ['name_si' => 'මාතර', 'name_en' => 'Matara'],
            ['name_si' => 'හම්බන්තොට', 'name_en' => 'Hambantota'],
            ['name_si' => 'යාපනය', 'name_en' => 'Jaffna'],
            ['name_si' => 'කිලිනොච්චි', 'name_en' => 'Kilinochchi'],
            ['name_si' => 'මන්නාරම', 'name_en' => 'Mannar'],
            ['name_si' => 'වව්නියාව', 'name_en' => 'Vavuniya'],
            ['name_si' => 'මුලතිව්', 'name_en' => 'Mullaitivu'],
            ['name_si' => 'බත්තිකලෝව', 'name_en' => 'Batticaloa'],
            ['name_si' => 'අම්පාර', 'name_en' => 'Ampara'],
            ['name_si' => 'ත්‍රිකුණාමලය', 'name_en' => 'Trincomalee'],
            ['name_si' => 'කුරුණෑගල', 'name_en' => 'Kurunegala'],
            ['name_si' => 'පුත්තලම', 'name_en' => 'Puttalam'],
            ['name_si' => 'අනුරාධපුර', 'name_en' => 'Anuradhapura'],
            ['name_si' => 'පොළොන්නරුව', 'name_en' => 'Polonnaruwa'],
            ['name_si' => 'බදුල්ල', 'name_en' => 'Badulla'],
            ['name_si' => 'මොණරාගල', 'name_en' => 'Monaragala'],
            ['name_si' => 'රත්නපුර', 'name_en' => 'Ratnapura'],
            ['name_si' => 'කෑගල්ල', 'name_en' => 'Kegalle'],
        ];

        foreach ($districts as $district) {
            District::create($district);
        }
    }
}
