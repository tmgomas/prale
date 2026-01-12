import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

export default function Success() {
    return (
        <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4">
            <Head title="Submission Received / ඉදිරිපත් කිරීම ලැබුණි" />

            <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit">
                        <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-500" />
                    </div>
                    <CardTitle className="text-2xl text-green-700 dark:text-green-500">
                        Submission Received!
                        <div className="text-lg font-normal mt-1">ඉදිරිපත් කිරීම ලැබුණි!</div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-6 pt-4">
                    <p className="text-muted-foreground">
                        Thank you for your submission. Your details have been recorded successfully.
                        <br />
                        <span className="text-sm">
                            ඔබගේ ඉදිරිපත් කිරීමට ස්තූතියි. ඔබගේ තොරතුරු සාර්ථකව සටහන් කර ගන්නා ලදී.
                        </span>
                    </p>

                    <div className="flex flex-col gap-2">
                        <Button asChild className="w-full">
                            <Link href="/submissions/create">
                                Submit Another / තවත් එකක් ඉදිරිපත් කරන්න
                            </Link>
                        </Button>

                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                Return Home / මුල් පිටුවට
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
