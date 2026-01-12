<?php

namespace Database\Seeders;

use App\Models\Sport;
use Illuminate\Database\Seeder;

class SportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sports = [
            ['code' => 51, 'name_si' => 'කබඩි', 'name_en' => 'Kabaddi'],
            ['code' => 52, 'name_si' => 'දැල්පන්දු', 'name_en' => 'Netball'],
            ['code' => 53, 'name_si' => 'පැසිපන්දු', 'name_en' => 'Basketball'],
            ['code' => 54, 'name_si' => 'වොලිබොල්', 'name_en' => 'Volleyball'],
            ['code' => 55, 'name_si' => 'පාපන්දු', 'name_en' => 'Football'],
            ['code' => 56, 'name_si' => 'ක්‍රිකට්', 'name_en' => 'Cricket'],
            ['code' => 57, 'name_si' => 'එල්ලේ', 'name_en' => 'Elle'],
            ['code' => 58, 'name_si' => 'කැරම්', 'name_en' => 'Carrom'],
            ['code' => 59, 'name_si' => 'වෙරළ වොලිබොල්', 'name_en' => 'Beach Volleyball'],
            ['code' => 60, 'name_si' => 'කඹ ඇදීම', 'name_en' => 'Tug of War'],
            ['code' => 70, 'name_si' => 'චෙස්', 'name_en' => 'Chess'],
            ['code' => 71, 'name_si' => 'බැට්මින්ටන්', 'name_en' => 'Badminton'],
        ];

        foreach ($sports as $sport) {
            Sport::create($sport);
        }
    }
}
