import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface District {
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

const DISTRICT_LEVEL_TEXT = 'දිස්ත්‍රික් මට්ටම';

export default function StepOne({ formData, setFormData, errors, districts }: Props) {
    const [submissionType, setSubmissionType] = useState<'district' | 'division'>(
        formData.division === DISTRICT_LEVEL_TEXT ? 'district' : 'division'
    );

    const handleTypeChange = (type: 'district' | 'division') => {
        setSubmissionType(type);
        if (type === 'district') {
            setFormData({ ...formData, division: DISTRICT_LEVEL_TEXT });
        } else {
            setFormData({ ...formData, division: '' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4 mb-6 p-4 border rounded-lg bg-muted/20">
                <Label className="text-base font-semibold">Select Data Entry Level / දත්ත ඇතුළත් කිරීමේ මට්ටම තෝරන්න</Label>
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
                        <Label htmlFor="type_division" className="cursor-pointer">Division Youth Sports / ප්‍රදේශිය යෞවන ක්‍රීඩා</Label>
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
                        <Label htmlFor="type_district" className="cursor-pointer">District Youth Sports / දිස්ත්‍රික් යෞවන ක්‍රීඩා</Label>
                    </div>
                </div>

                {submissionType === 'district' && (
                    <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            You have selected <strong>District Level</strong> data entry. Divisional Secretariat information is not required. <br />
                            ඔබ තෝරාගෙන ඇත්තේ <strong>දිස්ත්‍රික් මට්ටමේ</strong> දත්ත ඇතුළත් කිරීමයි. මෙහිදී ප්‍රාදේශීය ලේකම් කොට්ඨාසයේ තොරතුරු අවශ්‍ය නොවේ.
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="district">District / දිස්ත්‍රික්කය</Label>
                <Select
                    value={formData.district_id?.toString()}
                    onValueChange={(value) => setFormData({ ...formData, district_id: parseInt(value) })}
                >
                    <SelectTrigger className={errors.district_id ? "border-destructive" : ""}>
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

            {submissionType === 'division' && (
                <div className="space-y-2">
                    <Label htmlFor="division">Divisional Secretariat / ප්‍රාදේශීය ලේකම් කොට්ඨාසය</Label>
                    <Input
                        id="division"
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                        placeholder="Ex: Maharagama / උදා: මහරගම"
                        className={errors.division ? "border-destructive" : ""}
                    />
                    {errors.division && <p className="text-sm text-destructive">{errors.division}</p>}
                </div>
            )}
        </div>
    );
}
