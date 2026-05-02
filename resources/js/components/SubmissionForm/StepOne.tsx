import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface District {
    id: number;
    name_si: string;
    name_en: string;
}

interface Division {
    id: number;
    name_si: string;
    name_en: string;
}

interface Props {
    formData: any;
    setFormData: (data: any) => void;
    errors: Record<string, string>;
    districts: District[];
}

export default function StepOne({ formData, setFormData, errors, districts }: Props) {
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [loadingDivisions, setLoadingDivisions] = useState(false);

    const submissionType: 'district' | 'division' = formData.submission_type ?? 'division';

    const handleTypeChange = (type: 'district' | 'division') => {
        setFormData({ ...formData, submission_type: type, division_id: null });
        setDivisions([]);
    };

    // Fetch divisions whenever district changes (only for division type)
    useEffect(() => {
        if (!formData.district_id || submissionType !== 'division') {
            setDivisions([]);
            return;
        }

        setLoadingDivisions(true);
        fetch(`/api/divisions?district_id=${formData.district_id}`)
            .then((res) => res.json())
            .then((data: Division[]) => {
                setDivisions(data);
                // Only reset division_id if the current one is NOT in the new list
                setFormData((prev: any) => {
                    const stillValid = data.some((d) => d.id === prev.division_id);
                    return stillValid ? prev : { ...prev, division_id: null };
                });
            })
            .catch(() => setDivisions([]))
            .finally(() => setLoadingDivisions(false));
    }, [formData.district_id, submissionType]);

    return (
        <div className="space-y-6">

            {/* Submission Type Radio Buttons */}
            <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                <Label className="text-base font-semibold">
                    Select Data Entry Level / දත්ත ඇතුළත් කිරීමේ මට්ටම තෝරන්න
                </Label>
                <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="type_division"
                            name="submission_type"
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            checked={submissionType === 'division'}
                            onChange={() => handleTypeChange('division')}
                        />
                        <Label htmlFor="type_division" className="cursor-pointer">
                            Division Youth Sports / ප්‍රදේශිය යෞවන ක්‍රීඩා
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="type_district"
                            name="submission_type"
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                            checked={submissionType === 'district'}
                            onChange={() => handleTypeChange('district')}
                        />
                        <Label htmlFor="type_district" className="cursor-pointer">
                            District Youth Sports / දිස්ත්‍රික් යෞවන ක්‍රීඩා
                        </Label>
                    </div>
                </div>

                {submissionType === 'district' && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            You have selected <strong>District Level</strong> data entry. Divisional Secretariat information is not required.<br />
                            ඔබ තෝරාගෙන ඇත්තේ <strong>දිස්ත්‍රික් මට්ටමේ</strong> දත්ත ඇතුළත් කිරීමයි. මෙහිදී ප්‍රාදේශීය ලේකම් කොට්ඨාසයේ තොරතුරු අවශ්‍ය නොවේ.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {/* District Select */}
            <div className="space-y-2">
                <Label htmlFor="district">District / දිස්ත්‍රික්කය</Label>
                <Select
                    value={formData.district_id?.toString() ?? ''}
                    onValueChange={(value) =>
                        setFormData({ ...formData, district_id: parseInt(value), division_id: null })
                    }
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
                {errors.district_id && <p className="text-sm text-destructive">{errors.district_id}</p>}
            </div>

            {/* Division Select — only shown for 'division' type after district is picked */}
            {submissionType === 'division' && formData.district_id && (
                <div className="space-y-2">
                    <Label htmlFor="division">
                        Divisional Secretariat / ප්‍රාදේශීය ලේකම් කොට්ඨාසය
                    </Label>

                    {loadingDivisions ? (
                        <div className="flex items-center gap-2 h-10 px-3 border rounded-md text-muted-foreground text-sm">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Loading divisions...</span>
                        </div>
                    ) : (
                        <Select
                            value={formData.division_id?.toString() ?? ''}
                            onValueChange={(value) =>
                                setFormData({ ...formData, division_id: parseInt(value) })
                            }
                        >
                            <SelectTrigger className={errors.division_id ? 'border-destructive' : ''}>
                                <SelectValue placeholder="Select Division / ප්‍රාදේශීය ලේකම් කොට්ඨාසය තෝරන්න" />
                            </SelectTrigger>
                            <SelectContent>
                                {divisions.map((division) => (
                                    <SelectItem key={division.id} value={division.id.toString()}>
                                        {division.name_si} - {division.name_en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {errors.division_id && (
                        <p className="text-sm text-destructive">{errors.division_id}</p>
                    )}
                </div>
            )}
        </div>
    );
}
