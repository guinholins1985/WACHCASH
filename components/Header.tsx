import React from 'react';
import { View } from '../App';

interface HeaderProps {
    activeView: View;
    setActiveView: (view: View) => void;
    userName: string;
    balance: string;
}

const DollarSignIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v-2m0-4h.01M12 12h.01M12 10h.01M12 14h.01M5 12a7 7 0 1114 0 7 7 0 01-14 0z" />
    </svg>
);

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);


export const Header: React.FC<HeaderProps> = ({ activeView, setActiveView, userName, balance }) => {
    const navItemClasses = "cursor-pointer px-3 py-2 rounded-md text-sm md:text-base font-medium transition-colors duration-300";
    const activeClasses = "bg-indigo-600 text-white";
    const inactiveClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";
    
    const views = [
        { key: View.User, label: 'Usuário' },
        { key: View.Advertiser, label: 'Anunciante' },
        { key: View.Admin, label: 'Admin' }
    ];

    return (
        <header className="bg-gray-800 shadow-lg">
            <div className="container mx-auto px-4 md:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-2">
                        <DollarSignIcon className="text-indigo-400 h-8 w-8"/>
                        <h1 className="text-xl md:text-3xl font-bold text-white">WatchCash</h1>
                    </div>

                    <nav className="hidden md:flex items-center bg-gray-900 rounded-lg p-1 space-x-1">
                        {views.map(view => (
                             <button key={view.key} onClick={() => setActiveView(view.key)} className={`${navItemClasses} ${activeView === view.key ? activeClasses : inactiveClasses}`}>
                                {view.label}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center space-x-4">
                       <UserIcon className="text-gray-400"/>
                        <div>
                             <p className="text-sm text-gray-400">Bem-vindo, {userName}</p>
                             <p className="text-lg font-bold text-green-400">{balance}</p>
                        </div>
                    </div>
                </div>
                 <nav className="flex md:hidden items-center justify-center bg-gray-900 rounded-lg p-1 space-x-1 mb-4">
                    {views.map(view => (
                         <button key={view.key} onClick={() => setActiveView(view.key)} className={`${navItemClasses} ${activeView === view.key ? activeClasses : inactiveClasses}`}>
                            {view.label}
                        </button>
                    ))}
                </nav>
            </div>
        </header>
    );
};
