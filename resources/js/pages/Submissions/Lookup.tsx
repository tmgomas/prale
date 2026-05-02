import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertCircle } from 'lucide-react';

interface District {
    id: number;
    name_si: string;
    name_en: string;
}

interface Props {
    districts: District[];
    errors: Record<string, string>;
}

export default function Lookup({ districts, errors }: Props) {
    const { data, setData, post, processing } = useForm({
        epf_number: '',
        district_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/submissions/lookup');
    };

    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
            <Head title="ඉදිරිපත් කිරීම සොයන්න / Find Submission" />

            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            36th National Youth Sports Festival 2026
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                            36වන ජාතික යෞවන ක්‍රීඩා උළෙල 2026
                        </CardDescription>
                        <div className="mt-4 pt-4 border-t">
                            <p className="font-semibold text-foreground">Edit Your Submission / ඔබේ ඉදිරිපත් කිරීම සංස්කරණය කරන්න</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Enter your EPF number and district to access your submission.
                                <br />
                                ඔබේ EPF අංකය සහ දිස්ත්‍රික්කය ඇතුළත් කරන්න.
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Error Alert */}
                        {errors.epf_number && (
                            <Alert className="mb-4 bg-red-50 text-red-800 border-red-200">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{errors.epf_number}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* District */}
                            <div className="space-y-2">
                                <Label htmlFor="district_id">District / දිස්ත්‍රික්කය</Label>
                                <Select
                                    value={data.district_id}
                                    onValueChange={(value) => setData('district_id', value)}
                                >
                                    <SelectTrigger className={errors.district_id ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Select District / දිස්ත්‍රික්කය තෝරන්න" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districts.map((district) => (
                                            <SelectItem key={district.id} value={district.id.toString()}>
                                                {district.name_si} - {district.name_en}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.district_id && (
                                    <p className="text-sm text-destructive">{errors.district_id}</p>
                                )}
                            </div>

                            {/* EPF Number */}
                            <div className="space-y-2">
                                <Label htmlFor="epf_number">EPF Number / EPF අංකය</Label>
                                <Input
                                    id="epf_number"
                                    type="text"
                                    value={data.epf_number}
                                    onChange={(e) => setData('epf_number', e.target.value)}
                                    placeholder="Enter your EPF number / EPF අංකය ඇතුළත් කරන්න"
                                    className={errors.epf_number ? 'border-destructive' : ''}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                <Search className="h-4 w-4 mr-2" />
                                {processing ? 'Searching... / සොයමින්...' : 'Find Submission / ඉදිරිපත් කිරීම සොයන්න'}
                            </Button>
                        </form>

                        <div className="mt-6 pt-4 border-t text-center">
                            <p className="text-sm text-muted-foreground">
                                Haven't submitted yet?{' '}
                                <a href="/submissions/create" className="text-primary underline underline-offset-4">
                                    Submit Now / දැන් ඉදිරිපත් කරන්න
                                </a>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
