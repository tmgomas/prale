import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

interface Props {
    formData: any;
    setFormData: (data: any) => void;
}

export default function StepFour({ formData, setFormData }: Props) {
    const totalIncome = useMemo(() => {
        const { income_head_office, income_external_sources } = formData.financial;
        return (parseFloat(income_head_office) || 0) + (parseFloat(income_external_sources) || 0);
    }, [formData.financial.income_head_office, formData.financial.income_external_sources]);

    const totalExpense = useMemo(() => {
        const { expense_team_sports, expense_track_field } = formData.financial;
        return (parseFloat(expense_team_sports) || 0) + (parseFloat(expense_track_field) || 0);
    }, [formData.financial.expense_team_sports, formData.financial.expense_track_field]);

    const updateFinancial = (field: string, value: string) => {
        setFormData({
            ...formData,
            financial: {
                ...formData.financial,
                [field]: value,
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('si-LK', {
            style: 'currency',
            currency: 'LKR',
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Income Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Income Information / ආදායම් තොරතුරු</CardTitle>
                    <CardDescription>Enter details about received funds / ලැබුණු මුදල් ප්‍රතිපාදන පිළිබඳ තොරතුරු ඇතුළත් කරන්න</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="income_head_office">Amount form Head Office (Rs.) / ප්‍රධාන කාර්යාලයෙන් ලබාදුන් මුදල (රු.)</Label>
                        <Input
                            id="income_head_office"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial.income_head_office}
                            onChange={(e) => updateFinancial('income_head_office', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="income_external_sources">Amount from External Sources (Rs.) / බාහිර ප්‍රභවයන් මගින් සොයාගත් මුදල (රු.)</Label>
                        <Input
                            id="income_external_sources"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial.income_external_sources}
                            onChange={(e) => updateFinancial('income_external_sources', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg font-semibold">Total Income / සමස්ත ආදායම:</Label>
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(totalIncome)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Expenses Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Expense Information / වියදම් තොරතුරු</CardTitle>
                    <CardDescription>Enter details about expenses incurred / තරඟ පැවැත්වීම සඳහා දැරූ වියදම් ඇතුළත් කරන්න</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="expense_team_sports">Expenses for Team & Swimming Events (Rs.) / කණ්ඩායම් සහ පිහිණුම් තරඟ සඳහා වියදම (රු.)</Label>
                        <Input
                            id="expense_team_sports"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial.expense_team_sports}
                            onChange={(e) => updateFinancial('expense_team_sports', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expense_track_field">Expenses for Track & Field & Final Event (Rs.) / මළල ක්‍රීඩා සහ අවසාන උත්සවය සදහා වියදම (රු.)</Label>
                        <Input
                            id="expense_track_field"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.financial.expense_track_field}
                            onChange={(e) => updateFinancial('expense_track_field', e.target.value)}
                            placeholder="0.00"
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                            <Label className="text-lg font-semibold">Total Expenses / සමස්ත වියදම:</Label>
                            <span className="text-2xl font-bold text-red-600">
                                {formatCurrency(totalExpense)}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Section */}
            <Card className="bg-muted/50">
                <CardContent className="pt-6 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span>Total Income / මුළු ආදායම:</span>
                        <span className="font-medium">{formatCurrency(totalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span>Total Expenses / මුළු වියදම:</span>
                        <span className="font-medium">{formatCurrency(totalExpense)}</span>
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center">
                        <Label className="text-xl font-bold">Balance / ඉතිරිය / (හිඟය):</Label>
                        <span className={`text-3xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {formatCurrency(totalIncome - totalExpense)}
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
