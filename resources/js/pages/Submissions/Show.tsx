import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ArrowLeft } from 'lucide-react';

interface District {
    id: number;
    name_si: string;
    name_en: string;
}

interface Sport {
    id: number;
    code: number;
    name_si: string;
    name_en: string;
}

interface TeamSportData {
    id: number;
    sport: Sport;
    event_date: string | null;
    venue: string | null;
    teams_male: number;
    teams_female: number;
    players_male: number;
    players_female: number;
}

interface SwimmingData {
    id: number;
    event_date: string | null;
    venue: string | null;
    teams_male: number;
    teams_female: number;
    players_male: number;
    players_female: number;
}

interface TrackFieldData {
    id: number;
    event_date: string | null;
    venue: string | null;
    teams_male: number;
    teams_female: number;
    players_male: number;
    players_female: number;
}

interface FinancialData {
    id: number;
    income_head_office: number;
    income_external_sources: number;
    total_income: number;
    expense_team_sports: number;
    expense_track_field: number;
    total_expense: number;
}

interface Submission {
    id: number;
    district: District;
    division: string;
    officer_name: string;
    designation: string;
    epf_number: string;
    status: 'draft' | 'submitted';
    submitted_at: string | null;
    created_at: string;
    updated_at: string;
    team_sports_data: TeamSportData[];
    swimming_data: SwimmingData[];
    track_field_data: TrackFieldData[];
    financial_data: FinancialData | null;
}

interface Props {
    submission: Submission;
}

export default function Show({ submission }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'ඉදිරිපත් කිරීම්', href: '/submissions' },
        { title: `${submission.district.name_si} - ${submission.division}`, href: `/submissions/${submission.id}` },
    ];

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('si-LK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('si-LK', {
            style: 'currency',
            currency: 'LKR',
        }).format(amount);
    };

    const handleDelete = () => {
        if (confirm('ඔබට මෙම ඉදිරිපත් කිරීම මකා දැමීමට අවශ්‍යද?')) {
            router.delete(`/submissions/${submission.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${submission.district.name_si} - ${submission.division}`} />

            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <Link href="/submissions">
                            <Button variant="ghost" size="sm" className="mb-2">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                ආපසු යන්න
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            {submission.district.name_si} - {submission.division}
                            {submission.status === 'submitted' ? (
                                <Badge variant="default">ඉදිරිපත් කළා</Badge>
                            ) : (
                                <Badge variant="secondary">කෙටුම්පත</Badge>
                            )}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {submission.status === 'draft' && (
                            <Link href={`/submissions/${submission.id}/edit`}>
                                <Button>
                                    <Edit className="w-4 h-4 mr-2" />
                                    සංස්කරණය
                                </Button>
                            </Link>
                        )}
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" />
                            මකන්න
                        </Button>
                    </div>
                </div>

                {/* Officer Information */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>නිළධාරී තොරතුරු</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">නිළධාරී නම</p>
                                <p className="font-medium">{submission.officer_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">තනතුර</p>
                                <p className="font-medium">{submission.designation}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">EPF අංකය</p>
                                <p className="font-medium">{submission.epf_number}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Sports Data */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>කණ්ඩායම ක්‍රීඩා ප්‍රගතිය</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 text-left text-sm font-medium">අංකය</th>
                                        <th className="p-2 text-left text-sm font-medium">ක්‍රීඩාව</th>
                                        <th className="p-2 text-left text-sm font-medium">දිනය</th>
                                        <th className="p-2 text-left text-sm font-medium">ස්ථානය</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>කණ්ඩායම්</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>ක්‍රීඩකයන්</th>
                                    </tr>
                                    <tr className="border-b bg-muted/50">
                                        <th colSpan={4}></th>
                                        <th className="p-2 text-center text-xs">පිරිමි</th>
                                        <th className="p-2 text-center text-xs">ගැහැණු</th>
                                        <th className="p-2 text-center text-xs">පිරිමි</th>
                                        <th className="p-2 text-center text-xs">ගැහැණු</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submission.team_sports_data.map((row) => (
                                        <tr key={row.id} className="border-b">
                                            <td className="p-2 text-sm">{row.sport.code}</td>
                                            <td className="p-2 text-sm">{row.sport.name_si}</td>
                                            <td className="p-2 text-sm">{formatDate(row.event_date)}</td>
                                            <td className="p-2 text-sm">{row.venue || '-'}</td>
                                            <td className="p-2 text-center text-sm">{row.teams_male}</td>
                                            <td className="p-2 text-center text-sm">{row.teams_female}</td>
                                            <td className="p-2 text-center text-sm">{row.players_male}</td>
                                            <td className="p-2 text-center text-sm">{row.players_female}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Swimming Data */}
                {submission.swimming_data.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>පිහිණුම් ප්‍රගතිය</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2 text-left text-sm font-medium">දිනය</th>
                                            <th className="p-2 text-left text-sm font-medium">ස්ථානය</th>
                                            <th className="p-2 text-center text-sm font-medium" colSpan={2}>පැවැත්වූ ඉසව් ගණන</th>
                                            <th className="p-2 text-center text-sm font-medium" colSpan={2}>ක්‍රීඩකයන්</th>
                                        </tr>
                                        <tr className="border-b bg-muted/50">
                                            <th colSpan={2}></th>
                                            <th className="p-2 text-center text-xs">පිරිමි</th>
                                            <th className="p-2 text-center text-xs">ගැහැණු</th>
                                            <th className="p-2 text-center text-xs">පිරිමි</th>
                                            <th className="p-2 text-center text-xs">ගැහැණු</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submission.swimming_data.map((row) => (
                                            <tr key={row.id} className="border-b">
                                                <td className="p-2 text-sm">{formatDate(row.event_date)}</td>
                                                <td className="p-2 text-sm">{row.venue || '-'}</td>
                                                <td className="p-2 text-center text-sm">{row.teams_male}</td>
                                                <td className="p-2 text-center text-sm">{row.teams_female}</td>
                                                <td className="p-2 text-center text-sm">{row.players_male}</td>
                                                <td className="p-2 text-center text-sm">{row.players_female}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Track & Field Data */}
                {submission.track_field_data.length > 0 && (
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>මළල ක්‍රීඩා හා අවසන් තරඟ ප්‍රගතිය</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="p-2 text-left text-sm font-medium">දිනය</th>
                                            <th className="p-2 text-left text-sm font-medium">ස්ථානය</th>
                                            <th className="p-2 text-center text-sm font-medium" colSpan={2}>පැවැත්වූ ඉසව් ගණන</th>
                                            <th className="p-2 text-center text-sm font-medium" colSpan={2}>ක්‍රීඩකයන්</th>
                                        </tr>
                                        <tr className="border-b bg-muted/50">
                                            <th colSpan={2}></th>
                                            <th className="p-2 text-center text-xs">පිරිමි</th>
                                            <th className="p-2 text-center text-xs">ගැහැණු</th>
                                            <th className="p-2 text-center text-xs">පිරිමි</th>
                                            <th className="p-2 text-center text-xs">ගැහැණු</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {submission.track_field_data.map((row) => (
                                            <tr key={row.id} className="border-b">
                                                <td className="p-2 text-sm">{formatDate(row.event_date)}</td>
                                                <td className="p-2 text-sm">{row.venue || '-'}</td>
                                                <td className="p-2 text-center text-sm">{row.teams_male}</td>
                                                <td className="p-2 text-center text-sm">{row.teams_female}</td>
                                                <td className="p-2 text-center text-sm">{row.players_male}</td>
                                                <td className="p-2 text-center text-sm">{row.players_female}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Financial Data */}
                {submission.financial_data && (
                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>මූල්‍ය තොරතුරු</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Income Section */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">ආදායම්</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">ප්‍රධාන කාර්යාලයෙන්:</span>
                                            <span className="font-medium">{formatCurrency(submission.financial_data.income_head_office)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">බාහිර ප්‍රභවයන්:</span>
                                            <span className="font-medium">{formatCurrency(submission.financial_data.income_external_sources)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-sm font-medium text-muted-foreground mr-2">මුළු ආදායම:</span>
                                        <span className="text-lg font-bold text-green-600">{formatCurrency(submission.financial_data.total_income)}</span>
                                    </div>
                                </div>

                                {/* Expense Section */}
                                <div>
                                    <h3 className="font-semibold text-lg mb-3 border-b pb-2">වියදම්</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">කණ්ඩායම් සහ පිහිණුම්:</span>
                                            <span className="font-medium">{formatCurrency(submission.financial_data.expense_team_sports)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">මළල ක්‍රීඩා:</span>
                                            <span className="font-medium">{formatCurrency(submission.financial_data.expense_track_field)}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-right">
                                        <span className="text-sm font-medium text-muted-foreground mr-2">මුළු වියදම:</span>
                                        <span className="text-lg font-bold text-red-600">{formatCurrency(submission.financial_data.total_expense)}</span>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="pt-4 border-t flex justify-between items-center bg-muted/20 p-4 rounded-lg">
                                    <span className="text-lg font-bold">ශේෂය:</span>
                                    <span className={`text-2xl font-bold ${submission.financial_data.total_income - submission.financial_data.total_expense >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                        {formatCurrency(submission.financial_data.total_income - submission.financial_data.total_expense)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
