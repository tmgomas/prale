<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <table>
        <thead>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 4) }}" style="text-align: center; font-weight: bold; font-size: 14px;">
                    35 වන ජාතික යෞවන ක්රීඩා උළෙල - 2025
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 4) }}" style="text-align: center; font-weight: bold; font-size: 14px;">
                    ප්රාදේශීය සහ දිස්ත්රික් තරුණ සහභාගීත්වය
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 4) }}" style="text-align: center; font-size: 12px;">
                    (අදාල ප්රාදේශීය සහ දිස්ත්රික් භාර තරුණ සේවා නිලධාරීන් ලබාදුන් තොරතුරු අනුව)
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 4) }}" style="font-weight: bold; font-size: 16px; text-align: center;">
                    Sports Participation Matrix - District: {{ $district->name_en }}
                </th>
            </tr>
            <tr>
                <th rowspan="3" style="font-weight: bold; vertical-align: middle; border: 1px solid #000000;">Division Name</th>
                @foreach($sports as $sport)
                    <th colspan="4" style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $sport->name_en }}</th>
                @endforeach
            </tr>
            <tr>
                @foreach($sports as $sport)
                    <th colspan="2" style="font-weight: bold; text-align: center; border: 1px solid #000000; color: #1d4ed8;">M</th>
                    <th colspan="2" style="font-weight: bold; text-align: center; border: 1px solid #000000; color: #be185d;">W</th>
                @endforeach
            </tr>
            <tr>
                @foreach($sports as $sport)
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000;">T</th>
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000;">P</th>
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000;">T</th>
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000;">P</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @php
                $normalDivisions = [];
                $districtLevelKey = null;
                $districtLevelData = null;

                foreach($matrixData as $divisionName => $data) {
                    $isDistrict = false;
                    // Check for District Level keywords
                    if (
                        stripos($divisionName, 'District Level') !== false || 
                        strpos($divisionName, 'දිස්ත්රික්') !== false || 
                        strpos($divisionName, 'දිස්ත්‍රික්') !== false
                    ) {
                        $isDistrict = true; 
                    }

                    if ($isDistrict) {
                        $districtLevelKey = $divisionName;
                        $districtLevelData = $data;
                    } else {
                        $normalDivisions[$divisionName] = $data;
                    }
                }
            @endphp

            @foreach($normalDivisions as $divisionName => $sportsData)
                <tr>
                    <td style="border: 1px solid #000000;">{{ $divisionName }}</td>
                    @foreach($sports as $sport)
                        @php
                            $data = $sportsData[$sport->id] ?? null;
                            $menTeams = $data['men_teams'] ?? 0;
                            $menPart = $data['men_participants'] ?? 0;
                            $womenTeams = $data['women_teams'] ?? 0;
                            $womenPart = $data['women_participants'] ?? 0;
                        @endphp
                        <td style="text-align: center; border: 1px solid #000000;">{{ $menTeams > 0 ? $menTeams : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000;">{{ $menPart > 0 ? $menPart : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000;">{{ $womenTeams > 0 ? $womenTeams : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000;">{{ $womenPart > 0 ? $womenPart : '-' }}</td>
                    @endforeach
                </tr>
            @endforeach

            <!-- Totals Row (Only for Normal Divisions) -->
            <tr>
                <td style="font-weight: bold; border: 1px solid #000000;">Total</td>
                @foreach($sports as $sport)
                    @php
                        $totalMenTeams = 0;
                        $totalMenPart = 0;
                        $totalWomenTeams = 0;
                        $totalWomenPart = 0;
                        foreach($normalDivisions as $divisionName => $sportsData) {
                             $data = $sportsData[$sport->id] ?? null;
                             $totalMenTeams += ($data['men_teams'] ?? 0);
                             $totalMenPart += ($data['men_participants'] ?? 0);
                             $totalWomenTeams += ($data['women_teams'] ?? 0);
                             $totalWomenPart += ($data['women_participants'] ?? 0);
                        }
                    @endphp
                    <td style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $totalMenTeams > 0 ? $totalMenTeams : '-' }}</td>
                    <td style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $totalMenPart > 0 ? $totalMenPart : '-' }}</td>
                    <td style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $totalWomenTeams > 0 ? $totalWomenTeams : '-' }}</td>
                    <td style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $totalWomenPart > 0 ? $totalWomenPart : '-' }}</td>
                @endforeach
            </tr>

            <!-- District Level Row (At the bottom) -->
            @if($districtLevelKey)
                <tr>
                    <td style="font-weight: bold; border: 1px solid #000000; background-color: #fef08a;">{{ $districtLevelKey }}</td>
                     @foreach($sports as $sport)
                        @php
                            $data = $districtLevelData[$sport->id] ?? null;
                            $menTeams = $data['men_teams'] ?? 0;
                            $menPart = $data['men_participants'] ?? 0;
                            $womenTeams = $data['women_teams'] ?? 0;
                            $womenPart = $data['women_participants'] ?? 0;
                        @endphp
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a;">{{ $menTeams > 0 ? $menTeams : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a;">{{ $menPart > 0 ? $menPart : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a;">{{ $womenTeams > 0 ? $womenTeams : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a;">{{ $womenPart > 0 ? $womenPart : '-' }}</td>
                    @endforeach
                </tr>
            @endif
        </tbody>
    </table>
</body>
</html>
