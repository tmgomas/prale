import { Head, router } from '@inertiajs/react';
import { Check, Info, LayoutGrid, MapPin, Trophy, Printer } from 'lucide-react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface District {
    id: number;
    name_en: string;
    name_si: string;
}

interface Sport {
    id: number;
    name_en: string;
    name_si: string;
    code: string;
}

interface MatrixData {
    [divisionName: string]: {
        [sportId: number]: number;
    };
}

interface Props {
    districts: District[];
    sports: Sport[];
    selectedDistrictId: string | null;
    matrixData: MatrixData;
}

const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '#' },
    { title: 'Sports Participation Matrix', href: '#' },
];

export default function SportsMatrix({ districts, sports, selectedDistrictId, matrixData }: Props) {
    const handleDistrictChange = (value: string) => {
        router.get('/reports/sports-matrix', { district_id: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const sortedDivisions = React.useMemo(() => {
        const divisions = Object.keys(matrixData);
        const districtLevelKey = divisions.find(d =>
            d.toLowerCase().includes('district level') ||
            d.includes('දිස්ත්රික්') ||
            d.includes('දිස්ත්‍රික්')
        );

        const otherDivisions = divisions.filter(d => d !== districtLevelKey).sort();

        if (districtLevelKey) {
            return [...otherDivisions, districtLevelKey];
        }

        return otherDivisions;
    }, [matrixData]);

    const sportTotals = React.useMemo(() => {
        const totals: { [key: number]: number } = {};

        sports.forEach(sport => {
            let sum = 0;
            Object.values(matrixData).forEach(divisionData => {
                sum += (divisionData[sport.id] || 0);
            });
            totals[sport.id] = sum;
        });

        return totals;
    }, [matrixData, sports]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sports Participation Matrix" />

            <style>{`
                @media print {
                    @page {
                        size: landscape;
                        margin: 10mm;
                    }
                    
                    body {
                        visibility: hidden;
                        overflow: hidden; /* Prevent double scrollbars */
                    }

                    #printable-area {
                        visibility: visible;
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100vw;
                        height: 100vh;
                        padding: 20px;
                        background: white;
                        z-index: 9999;
                        overflow: visible;
                    }

                    #printable-area * {
                        visibility: visible;
                    }

                    /* Hide scrollbars during print */
                    ::-webkit-scrollbar {
                        display: none;
                    }
                }
            `}</style>

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            Sports Participation Matrix
                        </h1>
                        <p className="text-muted-foreground">
                            Track and monitor sport participation across different divisions.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="gap-2"
                            disabled={!selectedDistrictId}
                        >
                            <Printer className="w-4 h-4" />
                            Print Report
                        </Button>

                        <div className="flex items-center gap-3 bg-card border rounded-lg p-2 shadow-sm">
                            <div className="bg-primary/10 p-2 rounded-md">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <Select
                                value={selectedDistrictId?.toString() || ""}
                                onValueChange={handleDistrictChange}
                            >
                                <SelectTrigger className="w-[240px] border-none shadow-none focus:ring-0">
                                    <SelectValue placeholder="Select a District" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districts.map((district) => (
                                        <SelectItem key={district.id} value={district.id.toString()}>
                                            {district.name_en} ({district.name_si})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {!selectedDistrictId ? (
                    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 bg-muted/30">
                        <div className="bg-primary/10 p-6 rounded-full mb-6">
                            <LayoutGrid className="w-12 h-12 text-primary/60" />
                        </div>
                        <CardTitle className="text-2xl mb-2">No District Selected</CardTitle>
                        <CardDescription className="max-w-md">
                            Please select a district from the dropdown above to view the divisional sport participation matrix.
                        </CardDescription>
                    </Card>
                ) : (
                    <div id="printable-area">
                        <div className="hidden print:block mb-6">
                            <h1 className="text-2xl font-bold">Sports Participation Matrix</h1>
                            <p className="text-muted-foreground">
                                District: {districts.find(d => d.id.toString() === selectedDistrictId)?.name_en}
                            </p>
                        </div>

                        <Card className="overflow-hidden border shadow-xl bg-card/50 backdrop-blur-sm print:shadow-none print:border-none">
                            <CardHeader className="border-b bg-muted/50 py-4 print:bg-transparent print:p-0 print:border-none print:mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                        <CardTitle className="text-lg">Divisional Participation Status</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm shadow-green-200 print:bg-green-500 print:shadow-none" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} />
                                            <span className="text-xs font-medium text-muted-foreground">Participated</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-muted border print:bg-gray-200" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }} />
                                            <span className="text-xs font-medium text-muted-foreground">Not Participating</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        <thead>
                                            <tr className="bg-muted/30 border-b print:bg-gray-100" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                                                <th className="sticky left-0 z-20 bg-background border-r p-4 text-left font-bold text-sm min-w-[200px] print:static print:bg-transparent">
                                                    Division Name
                                                </th>
                                                {sports.map((sport) => (
                                                    <th
                                                        key={sport.id}
                                                        className="p-3 text-center border-r font-medium text-xs min-w-[100px] hover:bg-muted/50 transition-colors print:min-w-0"
                                                    >
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <div className="flex flex-col items-center gap-1 cursor-help print:cursor-default">
                                                                        <Badge variant="outline" className="font-mono text-[10px] px-1 bg-white dark:bg-zinc-900 print:border-gray-300">
                                                                            {sport.code}
                                                                        </Badge>
                                                                        <span className="truncate max-w-[80px] print:max-w-none print:text-[10px]">{sport.name_en}</span>
                                                                    </div>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p className="font-bold">{sport.name_en}</p>
                                                                    <p className="text-xs text-muted-foreground">{sport.name_si}</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedDivisions.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={sports.length + 1}
                                                        className="p-12 text-center text-muted-foreground bg-muted/10 print:bg-transparent"
                                                    >
                                                        <Info className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                                        No submission data found for the selected district.
                                                    </td>
                                                </tr>
                                            ) : (
                                                sortedDivisions.map((division) => (
                                                    <tr key={division} className="border-b transition-colors hover:bg-primary/5 group print:break-inside-avoid">
                                                        <td className="sticky left-0 z-10 bg-background border-r p-4 font-semibold text-sm group-hover:bg-transparent print:static print:bg-transparent">
                                                            {division}
                                                        </td>
                                                        {sports.map((sport) => {
                                                            const count = matrixData[division]?.[sport.id] || 0;
                                                            return (
                                                                <td
                                                                    key={sport.id}
                                                                    className="p-0 border-r text-center"
                                                                >
                                                                    <div className="flex items-center justify-center h-12 w-full text-sm">
                                                                        {count > 0 ? (
                                                                            <span className="font-medium text-green-600 print:text-black">
                                                                                {count}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="text-muted-foreground/30 print:hidden">-</span>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                        <tfoot>
                                            <tr className="bg-muted/50 border-t-2 border-primary/20 font-bold print:border-black print:bg-gray-200" style={{ printColorAdjust: 'exact', WebkitPrintColorAdjust: 'exact' }}>
                                                <td className="sticky left-0 z-10 bg-muted/50 p-4 border-r print:bg-gray-200">
                                                    Total
                                                </td>
                                                {sports.map((sport) => (
                                                    <td key={sport.id} className="p-3 text-center border-r">
                                                        {sportTotals[sport.id] > 0 ? sportTotals[sport.id] : '-'}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
