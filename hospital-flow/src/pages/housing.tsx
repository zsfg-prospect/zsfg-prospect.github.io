import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { HousingCard } from '../components/HousingCard';
import { Housing } from '../types/api';

export default function HousingPage() {
  const router = useRouter();
  const { id } = router.query;

  // Mock housing data - in a real app, this would come from an API
  const mockHousing: Housing = {
    summary: 'Patient is currently experiencing housing instability and has been staying with friends.',
    citations: [{
      note_id: 123,
      quote: 'Patient reported being unable to maintain stable housing and has been couch surfing with friends for the past month.'
    }]
  };

  return (
    <>
      <Head>
        <title>Housing Information | Social Services Note Viewer</title>
        <meta name="description" content="View housing information for patients" />
      </Head>
      <Layout showSidebar={true}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Housing Information</h1>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return to Home
            </button>
          </div>

          <div className="space-y-6">
            <HousingCard
              housing={mockHousing}
              isExpanded={true}
              onToggleExpand={() => {}}
            />
          </div>
        </div>
      </Layout>
    </>
  );
} 