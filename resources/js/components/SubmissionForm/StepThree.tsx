import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface Sport {
    id: number;
    code: number;
    name_si: string;
    name_en: string;
}

interface Props {
    formData: any;
    setFormData: (data: any) => void;
    sports: Sport[];
}

export default function StepThree({ formData, setFormData, sports }: Props) {
    const updateTeamSport = (index: number, field: string, value: any) => {
        const updated = [...formData.team_sports];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, team_sports: updated });
    };

    const addSwimmingRow = () => {
        setFormData({
            ...formData,
            swimming: [
                ...formData.swimming,
                {
                    event_date: '',
                    venue: '',
                    event_name: '',
                    teams_male: 0,
                    teams_female: 0,
                    players_male: 0,
                    players_female: 0,
                },
            ],
        });
    };

    const removeSwimmingRow = (index: number) => {
        const updated = formData.swimming.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, swimming: updated });
    };

    const updateSwimming = (index: number, field: string, value: any) => {
        const updated = [...formData.swimming];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, swimming: updated });
    };

    const addTrackFieldRow = () => {
        setFormData({
            ...formData,
            track_field: [
                ...formData.track_field,
                {
                    event_date: '',
                    venue: '',
                    event_name: '',
                    teams_male: 0,
                    teams_female: 0,
                    players_male: 0,
                    players_female: 0,
                },
            ],
        });
    };

    const removeTrackFieldRow = (index: number) => {
        const updated = formData.track_field.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, track_field: updated });
    };

    const updateTrackField = (index: number, field: string, value: any) => {
        const updated = [...formData.track_field];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, track_field: updated });
    };

    return (
        <div className="space-y-8">
            {/* Team Sports Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Team Sports Progress / කණ්ඩායම් ක්‍රීඩා ප්‍රගතිය</CardTitle>
                    <CardDescription>Enter details for all team sports / සියලුම කණ්ඩායම් ක්‍රීඩා සඳහා තොරතුරු ඇතුළත් කරන්න</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2 text-left text-sm font-medium">No <br /> අංකය</th>
                                    <th className="p-2 text-left text-sm font-medium">Sport <br /> ක්‍රීඩාව</th>
                                    <th className="p-2 text-left text-sm font-medium">Date <br /> දිනය</th>
                                    <th className="p-2 text-left text-sm font-medium">Venue <br /> ස්ථානය</th>
                                    <th className="p-2 text-center text-sm font-medium" colSpan={2}>Team Count <br /> කණ්ඩායම් ප්‍රමාණය</th>
                                    <th className="p-2 text-center text-sm font-medium" colSpan={2}>Player Count <br /> ක්‍රීඩක සංඛ්‍යාව</th>
                                </tr>
                                <tr className="border-b">
                                    <th colSpan={4}></th>
                                    <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                    <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                    <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                    <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.team_sports.map((row: any, index: number) => {
                                    const sport = sports.find(s => s.id === row.sport_id);
                                    return (
                                        <tr key={index} className="border-b">
                                            <td className="p-2 text-sm">{sport?.code}</td>
                                            <td className="p-2 text-sm">{sport?.name_si} / {sport?.name_en}</td>
                                            <td className="p-2">
                                                <Input
                                                    type="date"
                                                    value={row.event_date}
                                                    onChange={(e) => updateTeamSport(index, 'event_date', e.target.value)}
                                                    className="w-full"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="text"
                                                    value={row.venue}
                                                    onChange={(e) => updateTeamSport(index, 'venue', e.target.value)}
                                                    className="w-full"
                                                    placeholder="Venue / ස්ථානය"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_male}
                                                    onChange={(e) => updateTeamSport(index, 'teams_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_female}
                                                    onChange={(e) => updateTeamSport(index, 'teams_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_male}
                                                    onChange={(e) => updateTeamSport(index, 'players_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_female}
                                                    onChange={(e) => updateTeamSport(index, 'players_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Swimming Events Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Swimming Progress / පිහිණුම් ප්‍රගතිය</CardTitle>
                            <CardDescription>Enter details for swimming events / පිහිණුම් ඉසව් සඳහා තොරතුරු ඇතුළත් කරන්න</CardDescription>
                        </div>
                        <Button type="button" onClick={addSwimmingRow} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Row / පේළියක් එකතු කරන්න
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {formData.swimming.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Click above button to add a row / පේළියක් එකතු කිරීමට ඉහත බොත්තම ක්ලික් කරන්න
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 text-left text-sm font-medium">Date <br /> දිනය</th>
                                        <th className="p-2 text-left text-sm font-medium">Venue <br /> ස්ථානය</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>Events Held <br /> පැවැත්වූ ඉසව් ගණන</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>Player Count <br /> ක්‍රීඩක සංඛ්‍යාව</th>
                                        <th className="p-2"></th>
                                    </tr>
                                    <tr className="border-b">
                                        <th colSpan={2}></th>
                                        <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                        <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                        <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                        <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.swimming.map((row: any, index: number) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">
                                                <Input
                                                    type="date"
                                                    value={row.event_date}
                                                    onChange={(e) => updateSwimming(index, 'event_date', e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="text"
                                                    value={row.venue}
                                                    onChange={(e) => updateSwimming(index, 'venue', e.target.value)}
                                                    placeholder="Venue / ස්ථානය"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_male}
                                                    onChange={(e) => updateSwimming(index, 'teams_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_female}
                                                    onChange={(e) => updateSwimming(index, 'teams_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_male}
                                                    onChange={(e) => updateSwimming(index, 'players_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_female}
                                                    onChange={(e) => updateSwimming(index, 'players_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeSwimmingRow(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Track & Field Events Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Track & Field Progress / මළල ක්‍රීඩා හා අවසන් තරඟ ප්‍රගතිය</CardTitle>
                            <CardDescription>Enter details for Track & Field events / මළල ක්‍රීඩා ඉසව් සඳහා තොරතුරු ඇතුළත් කරන්න</CardDescription>
                        </div>
                        <Button type="button" onClick={addTrackFieldRow} size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Row / පේළියක් එකතු කරන්න
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {formData.track_field.length === 0 ? (
                        <p className="text-muted-foreground text-center py-4">
                            Click above button to add a row / පේළියක් එකතු කිරීමට ඉහත බොත්තම ක්ලික් කරන්න
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-2 text-left text-sm font-medium">Date <br /> දිනය</th>
                                        <th className="p-2 text-left text-sm font-medium">Venue <br /> ස්ථානය</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>Events Held <br /> පැවැත්වූ ඉසව් ගණන</th>
                                        <th className="p-2 text-center text-sm font-medium" colSpan={2}>Player Count <br /> ක්‍රීඩක සංඛ්‍යාව</th>
                                        <th className="p-2"></th>
                                    </tr>
                                    <tr className="border-b">
                                        <th colSpan={2}></th>
                                        <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                        <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                        <th className="p-2 text-center text-xs">Male <br /> පිරිමි</th>
                                        <th className="p-2 text-center text-xs">Female <br /> ගැහැණු</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.track_field.map((row: any, index: number) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-2">
                                                <Input
                                                    type="date"
                                                    value={row.event_date}
                                                    onChange={(e) => updateTrackField(index, 'event_date', e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="text"
                                                    value={row.venue}
                                                    onChange={(e) => updateTrackField(index, 'venue', e.target.value)}
                                                    placeholder="Venue / ස්ථානය"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_male}
                                                    onChange={(e) => updateTrackField(index, 'teams_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.teams_female}
                                                    onChange={(e) => updateTrackField(index, 'teams_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_male}
                                                    onChange={(e) => updateTrackField(index, 'players_male', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={row.players_female}
                                                    onChange={(e) => updateTrackField(index, 'players_female', parseInt(e.target.value) || 0)}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeTrackFieldRow(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-destructive" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
