import React from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
}

export default function Layout({ children, showSidebar = false }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex">
                {showSidebar && <Sidebar />}
                <main className={`min-h-screen ${showSidebar ? 'flex-1 p-8' : 'w-full'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
} 