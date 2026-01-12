import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StepOne from '@/components/SubmissionForm/StepOne';
import StepTwo from '@/components/SubmissionForm/StepTwo';
import StepThree from '@/components/SubmissionForm/StepThree';
import StepFour from '@/components/SubmissionForm/StepFour';

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

interface FinancialData {
    id: number;
    income_head_office: number;
    income_external_sources: number;
    expense_team_sports: number;
    expense_track_field: number;
}

interface Submission {
    id: number;
    district_id: number;
    division: string;
    officer_name: string;
    designation: string;
    epf_number: string;
    status: 'draft' | 'submitted';
    team_sports_data: Array<{
        sport: { id: number };
        event_date: string | null;
        venue: string | null;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    swimming_data: Array<{
        event_date: string | null;
        venue: string | null;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    track_field_data: Array<{
        event_date: string | null;
        venue: string | null;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    financial_data: FinancialData | null;
}

interface Props {
    submission: Submission;
    districts: District[];
    sports: Sport[];
}

interface FormData {
    district_id: number | null;
    division: string;
    officer_name: string;
    designation: string;
    epf_number: string;
    status: 'draft' | 'submitted';
    team_sports: Array<{
        sport_id: number;
        event_date: string;
        venue: string;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    swimming: Array<{
        event_date: string;
        venue: string;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    track_field: Array<{
        event_date: string;
        venue: string;
        teams_male: number;
        teams_female: number;
        players_male: number;
        players_female: number;
    }>;
    financial: {
        income_head_office: number;
        income_external_sources: number;
        expense_team_sports: number;
        expense_track_field: number;
    };
}

export default function Edit({ submission, districts, sports }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Submissions / ඉදිරිපත් කිරීම්', href: '/submissions' },
        { title: 'Edit / සංස්කරණය', href: `/submissions/${submission.id}/edit` },
    ];

    const [currentStep, setCurrentStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        district_id: submission.district_id,
        division: submission.division,
        officer_name: submission.officer_name,
        designation: submission.designation,
        epf_number: submission.epf_number,
        status: submission.status,
        team_sports: sports.map(sport => {
            const existing = submission.team_sports_data.find(d => d.sport.id === sport.id);
            return {
                sport_id: sport.id,
                event_date: existing?.event_date || '',
                venue: existing?.venue || '',
                teams_male: existing?.teams_male || 0,
                teams_female: existing?.teams_female || 0,
                players_male: existing?.players_male || 0,
                players_female: existing?.players_female || 0,
            };
        }),
        swimming: submission.swimming_data.length > 0 ? submission.swimming_data.map(d => ({
            event_date: d.event_date || '',
            venue: d.venue || '',
            teams_male: d.teams_male,
            teams_female: d.teams_female,
            players_male: d.players_male,
            players_female: d.players_female,
        })) : [{
            event_date: '',
            venue: '',
            teams_male: 0,
            teams_female: 0,
            players_male: 0,
            players_female: 0,
        }],
        track_field: submission.track_field_data.length > 0 ? submission.track_field_data.map(d => ({
            event_date: d.event_date || '',
            venue: d.venue || '',
            teams_male: d.teams_male,
            teams_female: d.teams_female,
            players_male: d.players_male,
            players_female: d.players_female,
        })) : [{
            event_date: '',
            venue: '',
            teams_male: 0,
            teams_female: 0,
            players_male: 0,
            players_female: 0,
        }],
        financial: {
            income_head_office: submission.financial_data?.income_head_office || 0,
            income_external_sources: submission.financial_data?.income_external_sources || 0,
            expense_team_sports: submission.financial_data?.expense_team_sports || 0,
            expense_track_field: submission.financial_data?.expense_track_field || 0,
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.district_id) newErrors.district_id = 'දිස්ත්‍රික්කය තෝරන්න';
            if (!formData.division.trim()) newErrors.division = 'ප්‍රාදේශීය ලේකම් කාර්යාලය ඇතුළත් කරන්න';
        }

        if (step === 2) {
            if (!formData.officer_name.trim()) newErrors.officer_name = 'නිළධාරී නම ඇතුළත් කරන්න';
            if (!formData.designation) newErrors.designation = 'තනතුර තෝරන්න';
            if (!formData.epf_number.trim()) newErrors.epf_number = 'EPF අංකය ඇතුළත් කරන්න';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = (status: 'draft' | 'submitted') => {
        const dataToSubmit = { ...formData, status };
        router.put(`/submissions/${submission.id}`, dataToSubmit);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Submission / ඉදිරිපත් කිරීම සංස්කරණය" />

            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">35th National Youth Sports Festival 2025 / 35වන ජාතික යෞවන ක්‍රීඩා උළෙල 2025</CardTitle>
                        <CardDescription>Edit Sports Progress / ප්‍රාදේශීය ක්‍රීඩා ප්‍රගතිය සංස්කරණය</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Indicator */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center">
                                {[1, 2, 3, 4].map((step) => (
                                    <div key={step} className="flex items-center flex-1">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {step}
                                        </div>
                                        {step < 4 && (
                                            <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-2 text-sm">
                                <span>Location / ස්ථානය</span>
                                <span>Officer / නිළධාරී</span>
                                <span>Sports Data / ක්‍රීඩා දත්ත</span>
                                <span>Financial / මූල්‍ය</span>
                            </div>
                        </div>

                        {/* Step Content */}
                        {currentStep === 1 && (
                            <StepOne
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                                districts={districts}
                            />
                        )}

                        {currentStep === 2 && (
                            <StepTwo
                                formData={formData}
                                setFormData={setFormData}
                                errors={errors}
                            />
                        )}

                        {currentStep === 3 && (
                            <StepThree
                                formData={formData}
                                setFormData={setFormData}
                                sports={sports}
                            />
                        )}

                        {currentStep === 4 && (
                            <StepFour
                                formData={formData}
                                setFormData={setFormData}
                            />
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 1}
                            >
                                Previous / පෙර
                            </Button>

                            <div className="flex gap-2">
                                {currentStep === 4 && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleSubmit('draft')}
                                        >
                                            Save as Draft / කෙටුම්පතක් ලෙස සුරකින්න
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => handleSubmit('submitted')}
                                        >
                                            Update / යාවත්කාලීන කරන්න
                                        </Button>
                                    </>
                                )}

                                {currentStep < 4 && (
                                    <Button
                                        type="button"
                                        onClick={handleNext}
                                    >
                                        Next / ඊළඟ
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
