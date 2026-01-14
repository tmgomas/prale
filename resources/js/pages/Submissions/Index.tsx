import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, FileDown } from 'lucide-react';

interface District {
    id: number;
    name_si: string;
    name_en: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface Submission {
    id: number;
    district: District;
    division: string;
    officer_name: string;
    designation: string;
    epf_number: string;
    status: 'draft' | 'submitted';
    user?: User;
    submitted_at?: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedSubmissions {
    data: Submission[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    submissions: PaginatedSubmissions;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'ඉදිරිපත් කිරීම්', href: '/submissions' },
];

export default function Index({ submissions }: Props) {
    const getStatusBadge = (status: string) => {
        if (status === 'submitted') {
            return <Badge variant="default">ඉදිරිපත් කළා</Badge>;
        }
        return <Badge variant="secondary">කෙටුම්පත</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('si-LK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="ඉදිරිපත් කිරීම්" />

            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold">ඉදිරිපත් කිරීම්</h1>
                        <p className="text-muted-foreground mt-1">
                            35වන ජාතික යෞවන ක්‍රීඩා උළෙල 2025 - දත්ත එකතු කිරීම
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {submissions.data.length > 0 && (
                            <a
                                href={`/submissions/export${window.location.search}`}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline">
                                    <FileDown className="w-4 h-4 mr-2" />
                                    Download PDF
                                </Button>
                            </a>
                        )}
                        <Link href="/submissions/create">
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                නව ඉදිරිපත් කිරීමක්
                            </Button>
                        </Link>
                    </div>
                </div>

                {submissions.data.length === 0 ? (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center">
                                <p className="text-muted-foreground text-lg mb-4">
                                    තවම ඉදිරිපත් කිරීම් නොමැත
                                </p>
                                <Link href="/submissions/create">
                                    <Button>
                                        <Plus className="w-4 h-4 mr-2" />
                                        පළමු ඉදිරිපත් කිරීම සාදන්න
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {submissions.data.map((submission) => (
                            <Card key={submission.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {submission.district.name_si} - {submission.division}
                                                {getStatusBadge(submission.status)}
                                            </CardTitle>
                                            <CardDescription className="mt-2">
                                                නිළධාරී: {submission.officer_name} ({submission.designation})
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/submissions/${submission.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    බලන්න
                                                </Button>
                                            </Link>
                                            {submission.status === 'draft' && (
                                                <Link href={`/submissions/${submission.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="w-4 h-4 mr-2" />
                                                        සංස්කරණය
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">EPF අංකය</p>
                                            <p className="font-medium">{submission.epf_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">සාදන ලද දිනය</p>
                                            <p className="font-medium">{formatDate(submission.created_at)}</p>
                                        </div>
                                        {submission.submitted_at && (
                                            <div>
                                                <p className="text-muted-foreground">ඉදිරිපත් කළ දිනය</p>
                                                <p className="font-medium">{formatDate(submission.submitted_at)}</p>
                                            </div>
                                        )}
                                        {submission.user && (
                                            <div>
                                                <p className="text-muted-foreground">සාදන ලද්දේ</p>
                                                <p className="font-medium">{submission.user.name}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Pagination */}
                        {submissions.last_page > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: submissions.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link key={page} href={`/submissions?page=${page}`}>
                                        <Button
                                            variant={page === submissions.current_page ? 'default' : 'outline'}
                                            size="sm"
                                        >
                                            {page}
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
