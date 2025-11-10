import Link from 'next/link';
import { useRouter } from 'next/router';

interface TabNavigationProps {
  className?: string;
}

export default function TabNavigation({ className = '' }: TabNavigationProps) {
  const router = useRouter();
  
  const isPatientDischargeActive = router.pathname.startsWith('/patient') || router.pathname === '/';
  const isHospitalDischargeActive = router.pathname === '/hospital-discharge';

  return (
    <nav className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          <Link
            href="/"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              isPatientDischargeActive
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Patient Flow Needs
          </Link>
          <Link
            href="/hospital-discharge"
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
              isHospitalDischargeActive
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hospital Flow Tasks
          </Link>
        </div>
      </div>
    </nav>
  );
}