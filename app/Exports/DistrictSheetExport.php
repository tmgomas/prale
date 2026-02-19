<?php

namespace App\Exports;

use App\Models\District;
use App\Models\Sport;
use App\Http\Controllers\ReportController;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Illuminate\Contracts\View\View;

class DistrictSheetExport implements FromView, WithTitle
{
    protected $district;
    protected $sports;

    public function __construct(District $district, $sports)
    {
        $this->district = $district;
        $this->sports = $sports;
    }

    public function view(): View
    {
        $matrixData = ReportController::getMatrixData($this->district->id);

        return view('reports.sports_matrix', [
            'district' => $this->district,
            'sports' => $this->sports,
            'matrixData' => $matrixData,
        ]);
    }

    public function title(): string
    {
        return $this->district->name_en;
    }
}
