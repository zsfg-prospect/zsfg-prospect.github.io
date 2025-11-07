import Head from 'next/head';
import { useRouter } from 'next/router';
import PatientSidebar from '../components/PatientSidebar';
import TabNavigation from '../components/TabNavigation';

export default function Home() {
    const router = useRouter();

    return (
        <>
            <Head>
                <title>Patient Discharge Needs | Social Services Note Viewer</title>
                <meta name="description" content="View and analyze social services notes and summaries" />
            </Head>
            <div className="flex flex-col h-screen">
                <TabNavigation />
                <div className="flex flex-1">
                    <PatientSidebar />
                    <div className="flex-1 overflow-auto">
                        <div className="max-w-7xl mx-auto p-4">
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <h1 className="text-3xl font-bold text-gray-900 mb-4">Patient Discharge Needs</h1>
                                <p className="text-gray-600 mb-6">Select a patient from the sidebar to view their discharge needs analysis.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 