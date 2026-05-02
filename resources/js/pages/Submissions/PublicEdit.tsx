import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    division_id: number | null;
    submission_type: 'district' | 'division';
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

export default function PublicEdit({ submission, districts, sports }: Props) {
    // Public users can only edit steps 3 (Sports Data) and 4 (Financial)
    const [currentStep, setCurrentStep] = useState(3);

    const [formData, setFormData] = useState<FormData>({
        district_id: submission.district_id,
        // submission.division stores the division_id (integer) for new submissions
        division_id: submission.division && !isNaN(parseInt(String(submission.division)))
            ? parseInt(String(submission.division))
            : null,
        submission_type: 'division',
        officer_name: submission.officer_name,
        designation: submission.designation,
        epf_number: submission.epf_number,
        status: submission.status,
        team_sports: sports.map(sport => {
            const existing = submission.team_sports_data.find(d => d.sport?.id === sport.id);
            return {
                sport_id: sport.id,
                event_date: existing?.event_date ? existing.event_date.substring(0, 10) : '',
                venue: existing?.venue || '',
                teams_male: existing?.teams_male || 0,
                teams_female: existing?.teams_female || 0,
                players_male: existing?.players_male || 0,
                players_female: existing?.players_female || 0,
            };
        }),
        swimming: submission.swimming_data.length > 0 ? submission.swimming_data.map(d => ({
            event_date: d.event_date ? d.event_date.substring(0, 10) : '',
            venue: d.venue || '',
            teams_male: d.teams_male,
            teams_female: d.teams_female,
            players_male: d.players_male,
            players_female: d.players_female,
        })) : [{
            event_date: '', venue: '', teams_male: 0, teams_female: 0, players_male: 0, players_female: 0,
        }],
        track_field: submission.track_field_data.length > 0 ? submission.track_field_data.map(d => ({
            event_date: d.event_date ? d.event_date.substring(0, 10) : '',
            venue: d.venue || '',
            teams_male: d.teams_male,
            teams_female: d.teams_female,
            players_male: d.players_male,
            players_female: d.players_female,
        })) : [{
            event_date: '', venue: '', teams_male: 0, teams_female: 0, players_male: 0, players_female: 0,
        }],
        financial: {
            income_head_office: submission.financial_data?.income_head_office || 0,
            income_external_sources: submission.financial_data?.income_external_sources || 0,
            expense_team_sports: submission.financial_data?.expense_team_sports || 0,
            expense_track_field: submission.financial_data?.expense_track_field || 0,
        },
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 4));
    const handlePrevious = () => setCurrentStep(prev => Math.max(prev - 1, 3));

    const handleSubmit = () => {
        const dataToSubmit = { ...formData, status: 'submitted' };
        router.put(`/submissions/${submission.id}/public-edit`, dataToSubmit);
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900">
            <Head title="Edit Submission / ඉදිරිපත් කිරීම සංස්කරණය" />

            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            36th National Youth Sports Festival 2026 / 36වන ජාතික යෞවන ක්‍රීඩා උළෙල 2026
                        </CardTitle>
                        <CardDescription>
                            Edit Sports Progress / ප්‍රාදේශීය ක්‍රීඩා ප්‍රගතිය සංස්කරණය
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Progress Indicator — Step 3 and 4 only */}
                        <div className="mb-8">
                            <div className="flex items-center max-w-xs">
                                {[3, 4].map((step) => (
                                    <div key={step} className="flex items-center flex-1">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                                            currentStep >= step
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}>
                                            {step === 3 ? 1 : 2}
                                        </div>
                                        {step < 4 && (
                                            <div className={`flex-1 h-1 mx-2 ${currentStep > step ? 'bg-primary' : 'bg-muted'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-24 mt-2 text-sm">
                                <span>Sports Data / ක්‍රීඩා දත්ත</span>
                                <span>Financial / මූල්‍ය</span>
                            </div>
                        </div>

                        {/* Step Content */}
                        {currentStep === 3 && (
                            <StepThree formData={formData} setFormData={setFormData} sports={sports} />
                        )}
                        {currentStep === 4 && (
                            <StepFour formData={formData} setFormData={setFormData} />
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                disabled={currentStep === 3}
                            >
                                Previous / පෙර
                            </Button>

                            <div className="flex gap-2">
                                {currentStep === 4 && (
                                    <Button type="button" onClick={handleSubmit}>
                                        Update / යාවත්කාලීන කරන්න
                                    </Button>
                                )}
                                {currentStep < 4 && (
                                    <Button type="button" onClick={handleNext}>
                                        Next / ඊළඟ
                                    </Button>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
