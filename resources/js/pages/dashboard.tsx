
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, Map, PieChart, Sparkles } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DivisionStat {
    division: string;
    count: number;
}

interface DistrictStat {
    id: number;
    name_en: string;
    name_si: string;
    submissions_count: number;
    division_breakdown: DivisionStat[];
}

interface DashboardProps {
    stats: {
        total_submissions: number;
        districts_active: number;
        divisions_active: number;
    };
    district_stats: DistrictStat[];
}

function DivisionItem({ district, division }: { district: DistrictStat; division: DivisionStat }) {
    const [analyzing, setAnalyzing] = React.useState(false);
    const [analysis, setAnalysis] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        setError(null);
        setAnalysis(null);

        try {
            const response = await fetch('/api/division-analysis/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    district_id: district.id,
                    division: division.division,
                    _token: (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setAnalysis(data.analysis);
            } else {
                setError(data.error || 'Failed to generate analysis');
            }
        } catch (err) {
            console.error('Analysis error:', err);
            setError('Network error. Please check if the server is running.');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="border rounded-md p-3 space-y-2">
            <div className="flex items-center justify-between">
                <Link
                    href={`/submissions?district_id=${district.id}&division=${encodeURIComponent(division.division)}`}
                    className="text-sm hover:underline text-blue-600 dark:text-blue-400 flex-1"
                >
                    {division.division || 'Unknown'}
                </Link>
                <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-bold">
                    {division.count}
                </span>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="w-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 rounded px-2 py-1.5 flex items-center justify-center gap-1"
            >
                {analyzing ? (
                    <>
                        <span className="animate-spin">⟳</span>
                        Analyzing...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-3 h-3" />
                        AI Analysis
                    </>
                )}
            </button>

            {analysis && (
                <div className="bg-muted rounded p-2 text-xs space-y-1">
                    <div className="font-semibold text-primary flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Insights:
                    </div>
                    <p className="text-muted-foreground whitespace-pre-wrap">{analysis}</p>
                </div>
            )}

            {error && (
                <div className="bg-destructive/10 text-destructive rounded p-2 text-xs">
                    {error}
                </div>
            )}
        </div>
    );
}

export default function Dashboard({ stats, district_stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-y-auto p-4">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                            <FileText className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_submissions}</div>
                            <p className="text-muted-foreground text-xs">Applications received</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Districts</CardTitle>
                            <Map className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.districts_active}</div>
                            <p className="text-muted-foreground text-xs">Districts with data</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Divisions</CardTitle>
                            <PieChart className="text-muted-foreground size-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.divisions_active}</div>
                            <p className="text-muted-foreground text-xs">Divisional secretariats</p>
                        </CardContent>
                    </Card>
                </div>

                {/* District Breakdown Table */}
                <Card className="flex-1 overflow-hidden">
                    <CardHeader>
                        <CardTitle>District Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            District Name
                                        </th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            Submissions
                                        </th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {district_stats.map((district) => (
                                        <tr
                                            key={district.id}
                                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                                        >
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="font-medium">{district.name_en}</div>
                                                <div className="text-muted-foreground text-xs">{district.name_si}</div>
                                            </td>
                                            <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{district.submissions_count}</span>
                                                    <div className="bg-secondary h-2 w-24 overflow-hidden rounded-full">
                                                        <div
                                                            className="bg-primary h-full"
                                                            style={{
                                                                width: `${stats.total_submissions > 0
                                                                    ? (district.submissions_count /
                                                                        stats.total_submissions) *
                                                                    100
                                                                    : 0
                                                                    }%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right align-middle [&:has([role=checkbox])]:pr-0">
                                                <Sheet>
                                                    <SheetTrigger asChild>
                                                        <button className="text-primary hover:underline text-sm font-medium">
                                                            View Breakdown
                                                        </button>
                                                    </SheetTrigger>
                                                    <SheetContent>
                                                        <SheetHeader>
                                                            <SheetTitle>
                                                                {district.name_en} ({district.name_si})
                                                            </SheetTitle>
                                                            <SheetDescription>
                                                                Breakdown of submissions by Divisional Secretariat.
                                                            </SheetDescription>
                                                        </SheetHeader>
                                                        <div className="mt-8 space-y-4 h-[calc(100vh-160px)] overflow-y-auto pr-2">
                                                            <div className="flex items-center justify-between border-b pb-2 font-medium sticky top-0 bg-background z-10">
                                                                <span>Division</span>
                                                                <span>Count</span>
                                                            </div>
                                                            {district.division_breakdown.length === 0 ? (
                                                                <div className="text-muted-foreground py-4 text-center text-sm">
                                                                    No submissions from this district yet.
                                                                </div>
                                                            ) : (
                                                                <div className="space-y-3">
                                                                    {district.division_breakdown.map((div, i) => (
                                                                        <DivisionItem
                                                                            key={i}
                                                                            district={district}
                                                                            division={div}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </SheetContent>
                                                </Sheet>
                                            </td>
                                        </tr>
                                    ))}
                                    {district_stats.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="p-4 text-center text-muted-foreground">
                                                No data available yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
