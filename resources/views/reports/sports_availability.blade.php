<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <table>
        <thead>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 2) }}" style="text-align: center; font-weight: bold; font-size: 14px;">
                    35 වන ජාතික යෞවන ක්රීඩා උළෙල - 2025
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 2) }}" style="text-align: center; font-weight: bold; font-size: 14px;">
                    ප්රාදේශීය සහ දිස්ත්රික් තරුණ ක්‍රීඩා පැවැත්ම (Sport Availability)
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 2) }}" style="text-align: center; font-size: 12px;">
                    (අදාල ප්රාදේශීය සහ දිස්ත්රික් භාර තරුණ සේවා නිලධාරීන් ලබාදුන් තොරතුරු අනුව)
                </th>
            </tr>
            <tr>
                <th colspan="{{ 1 + ($sports->count() * 2) }}" style="font-weight: bold; font-size: 16px; text-align: center;">
                    Sports Availability Matrix - District: {{ $district->name_en }}
                </th>
            </tr>
            <tr>
                <th rowspan="2" style="font-weight: bold; vertical-align: middle; border: 1px solid #000000;">Division Name</th>
                @foreach($sports as $sport)
                    <th colspan="2" style="font-weight: bold; text-align: center; border: 1px solid #000000;">{{ $sport->name_en }}</th>
                @endforeach
            </tr>
            <tr>
                @foreach($sports as $sport)
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000; color: #1d4ed8;">M</th>
                    <th style="font-weight: bold; text-align: center; border: 1px solid #000000; color: #be185d;">W</th>
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
                            $hasMen = $data && (($data['men_teams'] ?? 0) > 0 || ($data['men_participants'] ?? 0) > 0);
                            $hasWomen = $data && (($data['women_teams'] ?? 0) > 0 || ($data['women_participants'] ?? 0) > 0);
                        @endphp
                        <td style="text-align: center; border: 1px solid #000000; font-family: DejaVu Sans, sans-serif;">{{ $hasMen ? '✓' : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000; font-family: DejaVu Sans, sans-serif;">{{ $hasWomen ? '✓' : '-' }}</td>
                    @endforeach
                </tr>
            @endforeach

            <!-- District Level Row (At the bottom) -->
            @if($districtLevelKey)
                <tr>
                    <td style="font-weight: bold; border: 1px solid #000000; background-color: #fef08a;">{{ $districtLevelKey }}</td>
                     @foreach($sports as $sport)
                        @php
                            $data = $districtLevelData[$sport->id] ?? null;
                            $hasMen = $data && (($data['men_teams'] ?? 0) > 0 || ($data['men_participants'] ?? 0) > 0);
                            $hasWomen = $data && (($data['women_teams'] ?? 0) > 0 || ($data['women_participants'] ?? 0) > 0);
                        @endphp
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a; font-family: DejaVu Sans, sans-serif;">{{ $hasMen ? '✓' : '-' }}</td>
                        <td style="text-align: center; border: 1px solid #000000; font-weight: bold; background-color: #fef08a; font-family: DejaVu Sans, sans-serif;">{{ $hasWomen ? '✓' : '-' }}</td>
                    @endforeach
                </tr>
            @endif
        </tbody>
    </table>
</body>
</html>
