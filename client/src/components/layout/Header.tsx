import { useState } from 'react';
import { Origami, Menu, X, Home, FileText, Settings, Search } from 'lucide-react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Scalable Navigation Configuration
    // Just add new items here to update both Desktop and Mobile menus automatically
    const navItems = [
        { name: 'חיפוש', icon: Search, href: '#', id: "search" },
        { name: 'מסמכים', icon: FileText, href: '#', id: "documents" },
        { name: 'ראשי', icon: Home, href: '#', id: "home" },
    ];

    return (
        <header className="bg-slate-900 border-b border-purple-900/50 sticky top-0 z-50 shadow-lg shadow-purple-900/20 backdrop-blur-md bg-opacity-90">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-16 flex items-center justify-between">

                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-lg shadow-inner shadow-white/10 ring-1 ring-white/20">
                            <Origami className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-white tracking-wide">
                            PsyDoc
                        </h1>
                    </div>

                    {/* Desktop Navigation (Scalable) */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-all duration-200 group relative"
                            >
                                <item.icon className="w-4 h-4 text-purple-400 group-hover:text-fuchsia-400 transition-colors" />
                                {item.name}
                                {/* Hover Glow Effect */}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all group-hover:w-full"></span>
                            </a>
                        ))}

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-700 mx-2"></div>

                        {/* Profile / Settings */}
                        <div className="flex items-center gap-4">
                            <button className="text-slate-400 hover:text-white transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border border-white/20 cursor-pointer hover:ring-2 ring-purple-500/50 transition-all"></div>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-slate-300 hover:text-white p-2 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu (Dropdown) */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-900 border-b border-purple-900/50 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <div className="bg-slate-800 p-1.5 rounded-md">
                                    <item.icon className="w-5 h-5 text-purple-400" />
                                </div>
                                {item.name}
                            </a>
                        ))}
                        <div className="border-t border-slate-800 mt-2 pt-2">
                            <a
                                href="#"
                                className="flex items-center gap-3 px-3 py-3 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <Settings className="w-5 h-5 text-slate-400" />
                                Settings
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}