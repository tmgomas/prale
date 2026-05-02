import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome - 35වන ජාතික යෞවන ක්‍රීඩා උළෙල 2025 / 35th National Youth Sports Festival 2025" />
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 leading-tight">
                        දත්ත එකතු කිරීම <br/> <span className="text-2xl font-bold text-gray-700">Data Collection</span>
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        35වන ජාතික යෞවන ක්‍රීඩා උළෙල 2025 <br/> 35th National Youth Sports Festival 2025
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 px-4 sm:px-0">
                        
                        {/* Create New Submission */}
                        <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-blue-500">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <FilePlus className="w-8 h-8 text-blue-600" />
                                </div>
                                <CardTitle className="text-xl">නව ඉදිරිපත් කිරීම <br/><span className="text-lg">New Submission</span></CardTitle>
                                <CardDescription className="pt-2">
                                    අලුතින් දත්ත ඇතුළත් කිරීම සඳහා <br/> For entering new data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pt-4">
                                <Link href="/submissions/create">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 h-auto py-2 flex-col">
                                        <span>ඇතුළත් කරන්න</span>
                                        <span className="text-xs font-normal opacity-80 mt-0.5">Enter Data</span>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Edit Existing Submission */}
                        <Card className="hover:shadow-lg transition-shadow border-t-4 border-t-orange-500">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-orange-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <Edit3 className="w-8 h-8 text-orange-600" />
                                </div>
                                <CardTitle className="text-xl">සංස්කරණය <br/><span className="text-lg">Edit Submission</span></CardTitle>
                                <CardDescription className="pt-2">
                                    කලින් ඇතුළත් කළ දත්ත වෙනස් කිරීමට <br/> For editing previously entered data
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pt-4">
                                <Link href="/submissions/lookup">
                                    <Button variant="outline" className="w-full border-orange-200 hover:bg-orange-50 text-orange-700 h-auto py-2 flex-col">
                                        <span>සොයන්න</span>
                                        <span className="text-xs font-normal opacity-80 mt-0.5">Search</span>
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                    </div>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="text-sm font-medium text-gray-500 hover:text-gray-900">
                            කාර්යාලීය භාවිතය සඳහා පමණයි (Admin Login)
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
