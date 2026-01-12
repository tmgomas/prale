import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';

interface Props {
    formData: any;
    setFormData: (data: any) => void;
    errors: Record<string, string>;
}

const designations = [
    { value: 'AD', label: 'AD - Assistant Director' },
    { value: 'DYO', label: 'DYO - District Youth Officer' },
    { value: 'YSO', label: 'YSO - Youth Services Officer' },
    { value: 'AYSO', label: 'AYSO - Assistant Youth Services Officer' },
];

export default function StepTwo({ formData, setFormData, errors }: Props) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="officer_name">Officer Name / නිළධාරීගේ නම *</Label>
                <Input
                    id="officer_name"
                    type="text"
                    value={formData.officer_name}
                    onChange={(e) => setFormData({ ...formData, officer_name: e.target.value })}
                    placeholder="Enter Officer Name / නිළධාරී නම ඇතුළත් කරන්න"
                />
                {errors.officer_name && <InputError message={errors.officer_name} />}
            </div>

            <div className="space-y-2">
                <Label htmlFor="designation">Designation / තනතුර *</Label>
                <Select
                    value={formData.designation}
                    onValueChange={(value) => setFormData({ ...formData, designation: value })}
                >
                    <SelectTrigger id="designation">
                        <SelectValue placeholder="Select Designation / තනතුර තෝරන්න" />
                    </SelectTrigger>
                    <SelectContent>
                        {designations.map((designation) => (
                            <SelectItem key={designation.value} value={designation.value}>
                                {designation.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.designation && <InputError message={errors.designation} />}
            </div>

            <div className="space-y-2">
                <Label htmlFor="epf_number">EPF Number / සේවක අර්ධ සාධක අංකය (EPF) *</Label>
                <Input
                    id="epf_number"
                    type="text"
                    value={formData.epf_number}
                    onChange={(e) => setFormData({ ...formData, epf_number: e.target.value })}
                    placeholder="Enter EPF Number / EPF අංකය ඇතුළත් කරන්න"
                />
                {errors.epf_number && <InputError message={errors.epf_number} />}
            </div>
        </div>
    );
}
