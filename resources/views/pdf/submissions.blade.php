<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Submissions Export</title>
    <style>
        @font-face {
            font-family: 'Noto Sans Sinhala';
            font-style: normal;
            font-weight: normal;
            src: url(data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(public_path('fonts/NotoSansSinhala-Regular.ttf'))) }}) format('truetype');
        }
        @font-face {
            font-family: 'Noto Sans Sinhala';
            font-style: normal;
            font-weight: bold;
            src: url(data:font/truetype;charset=utf-8;base64,{{ base64_encode(file_get_contents(public_path('fonts/NotoSansSinhala-Bold.ttf'))) }}) format('truetype');
        }
        body {
            font-family: 'Noto Sans Sinhala', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .page {
            width: 100%;
            page-break-after: always;
            padding: 20px;
        }
        .page:last-child {
            page-break-after: avoid;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            font-size: 18px;
            margin: 0 0 5px 0;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 14px;
            margin: 0;
            font-weight: normal;
        }
        .section {
            margin-bottom: 15px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            background-color: #f0f0f0;
            padding: 5px;
            margin-bottom: 10px;
            border-left: 4px solid #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f9f9f9;
            font-weight: bold;
        }
        .info-grid {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }
        .info-row {
            display: table-row;
        }
        .info-label {
            display: table-cell;
            font-weight: bold;
            width: 150px;
            padding: 4px 0;
        }
        .info-value {
            display: table-cell;
            padding: 4px 0;
        }
        .meta-info {
            font-size: 10px;
            color: #777;
            text-align: right;
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    @foreach($submissions as $submission)
        <div class="page">
            <div class="header">
                <h1>35th National Youth Sports Festival 2025</h1>
                <h2>35වන ජාතික යෞවන ක්‍රීඩා උළෙල 2025</h2>
            </div>

            <div class="section">
                <div class="section-title">General Information / මූලික තොරතුරු</div>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="info-label">District / දිස්ත්‍රික්කය:</span>
                        <span class="info-value">{{ $submission->district->name_en }} ({{ $submission->district->name_si }})</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Division / ප්‍රා.ලේ. කොට්ඨාසය:</span>
                        <span class="info-value">{{ $submission->division }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Officer Name / නිළධාරී නම:</span>
                        <span class="info-value">{{ $submission->officer_name }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Designation / තනතුර:</span>
                        <span class="info-value">{{ $submission->designation }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">EPF Number / EPF අංකය:</span>
                        <span class="info-value">{{ $submission->epf_number }}</span>
                    </div>
                </div>
            </div>

            @if($submission->teamSportsData->count() > 0)
                <div class="section">
                    <div class="section-title">Team Sports / කණ්ඩායම් ක්‍රීඩා</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Sport</th>
                                <th>M Teams</th>
                                <th>F Teams</th>
                                <th>M Players</th>
                                <th>F Players</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($submission->teamSportsData as $data)
                                <tr>
                                    <td>{{ $data->sport->name_en }}</td>
                                    <td>{{ $data->teams_male }}</td>
                                    <td>{{ $data->teams_female }}</td>
                                    <td>{{ $data->players_male }}</td>
                                    <td>{{ $data->players_female }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif

            @if($submission->swimmingData->count() > 0)
                <div class="section">
                    <div class="section-title">Swimming / පිහිනුම්</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Teams (M/F)</th>
                                <th>Players (M/F)</th>
                                <th>Venue</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($submission->swimmingData as $data)
                                <tr>
                                    <td>{{ $data->teams_male }} / {{ $data->teams_female }}</td>
                                    <td>{{ $data->players_male }} / {{ $data->players_female }}</td>
                                    <td>{{ $data->venue ?? '-' }}</td>
                                    <td>{{ $data->event_date ? $data->event_date->format('Y-m-d') : '-' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif

            @if($submission->trackFieldData->count() > 0)
                <div class="section">
                    <div class="section-title">Track & Field / මලල ක්‍රීඩා</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Teams (M/F)</th>
                                <th>Players (M/F)</th>
                                <th>Venue</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($submission->trackFieldData as $data)
                                <tr>
                                    <td>{{ $data->teams_male }} / {{ $data->teams_female }}</td>
                                    <td>{{ $data->players_male }} / {{ $data->players_female }}</td>
                                    <td>{{ $data->venue ?? '-' }}</td>
                                    <td>{{ $data->event_date ? $data->event_date->format('Y-m-d') : '-' }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            @endif

            @if($submission->financialData)
                <div class="section">
                    <div class="section-title">Financial / මූල්‍ය</div>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount (LKR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Income (Head Office)</td>
                                <td>{{ number_format($submission->financialData->income_head_office, 2) }}</td>
                            </tr>
                            <tr>
                                <td>Income (External)</td>
                                <td>{{ number_format($submission->financialData->income_external_sources, 2) }}</td>
                            </tr>
                            <tr>
                                <td>Expense (Team Sports)</td>
                                <td>{{ number_format($submission->financialData->expense_team_sports, 2) }}</td>
                            </tr>
                            <tr>
                                <td>Expense (Track & Field)</td>
                                <td>{{ number_format($submission->financialData->expense_track_field, 2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            @endif

            <div class="meta-info">
                Generated on {{ now()->format('Y-m-d H:i:s') }} | ID: {{ $submission->id }}
            </div>
        </div>
    @endforeach
</body>
</html>
