<?php

namespace App\Exports;

use App\Models\District;
use App\Models\Sport;
use App\Http\Controllers\ReportController;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Illuminate\Contracts\View\View;

class DistrictSheetExport implements FromView, WithTitle, WithEvents
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

    public function registerEvents(): array
    {
        return [
            \Maatwebsite\Excel\Events\AfterSheet::class => function(\Maatwebsite\Excel\Events\AfterSheet $event) {
                $event->sheet->getPageSetup()->setOrientation(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::ORIENTATION_LANDSCAPE);
                $event->sheet->getPageSetup()->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_A3);
                $event->sheet->getPageSetup()->setFitToWidth(1);
                $event->sheet->getPageSetup()->setFitToHeight(0);

                // Set column width for data columns (M, W, T, P) to 4
                $highestColumn = $event->sheet->getHighestColumn();
                $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
                
                for ($col = 2; $col <= $highestColumnIndex; $col++) {
                    $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                    $event->sheet->getColumnDimension($columnLetter)->setWidth(4);
                }

                // Set row height for all table rows (headers and data) starting from Row 5 to 22
                $highestRow = $event->sheet->getHighestRow();
                for ($row = 5; $row <= $highestRow; $row++) {
                    $event->sheet->getRowDimension($row)->setRowHeight(22);
                }
                
                // Optional: Set text wrap for the header
                 $event->sheet->getStyle('A5:'.$highestColumn.'7')->getAlignment()->setWrapText(true);
            },
        ];
    }
}
