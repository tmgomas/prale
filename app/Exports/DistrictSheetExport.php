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
                $event->sheet->getPageSetup()->setPaperSize(\PhpOffice\PhpSpreadsheet\Worksheet\PageSetup::PAPERSIZE_LEGAL);
                $event->sheet->getPageSetup()->setFitToWidth(2);
                $event->sheet->getPageSetup()->setFitToHeight(1);

                // Set global font size for the sheet
                $event->sheet->getParent()->getDefaultStyle()->getFont()->setSize(14);
                // Also specifically set for the table area to be sure
                $highestColumn = $event->sheet->getHighestColumn();
                $highestRow = $event->sheet->getHighestRow();
                $event->sheet->getStyle('A1:' . $highestColumn . $highestRow)->getFont()->setSize(14);

                // Set column width for data columns (M, W, T, P) to 4
                $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
                
                for ($col = 2; $col <= $highestColumnIndex; $col++) {
                    $columnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($col);
                    $event->sheet->getColumnDimension($columnLetter)->setWidth(4);
                }

                // Set row height for all table rows (headers and data) starting from Row 5 to 22
                
                for ($row = 5; $row <= $highestRow; $row++) {
                    $event->sheet->getRowDimension($row)->setRowHeight(22);
                }

                // Add Page Break after "Elle"
                $colIndex = 1; // Start at A (1) is Division
                foreach ($this->sports as $sport) {
                    // Each sport takes 4 columns
                    $colIndex += 4;
                    
                    // Check if this is Elle
                    if (stripos($sport->name_en, 'Elle') !== false) {
                        // Break at the NEXT column
                        $breakColumnIndex = $colIndex + 1;
                        $breakColumnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($breakColumnIndex);
                        $event->sheet->setBreak($breakColumnLetter . '1', \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::BREAK_COLUMN);
                        break; 
                    }
                }
                
                // Optional: Set text wrap for the header
                 $event->sheet->getStyle('A5:'.$highestColumn.'7')->getAlignment()->setWrapText(true);
            },
        ];
    }
}
