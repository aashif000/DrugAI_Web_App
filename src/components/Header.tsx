
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Home, Search, Database, MessageSquare, Image, Volume2, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200/50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Drug AI
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem to="/" icon={<Home className="h-4 w-4 mr-1" />} label="Home" />
            <NavItem to="/search" icon={<Search className="h-4 w-4 mr-1" />} label="Search" />
            <NavItem to="/database" icon={<Database className="h-4 w-4 mr-1" />} label="Database" />
            <NavItem to="/chat" icon={<MessageSquare className="h-4 w-4 mr-1" />} label="AI Chat" />
            <NavItem to="/image-upload" icon={<Image className="h-4 w-4 mr-1" />} label="Image Upload" />
            <NavItem to="/tts" icon={<Volume2 className="h-4 w-4 mr-1" />} label="Text to Speech" />
          </nav>
        )}

        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {isMobile && (
        <div 
          className={cn(
            "fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b">
              <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Drug AI
              </span>
            </div>
            <nav className="p-4 flex flex-col space-y-1">
              <MobileNavItem to="/" icon={<Home className="h-5 w-5 mr-2" />} label="Home" onClick={() => setIsSidebarOpen(false)} />
              <MobileNavItem to="/search" icon={<Search className="h-5 w-5 mr-2" />} label="Search" onClick={() => setIsSidebarOpen(false)} />
              <MobileNavItem to="/database" icon={<Database className="h-5 w-5 mr-2" />} label="Database" onClick={() => setIsSidebarOpen(false)} />
              <MobileNavItem to="/chat" icon={<MessageSquare className="h-5 w-5 mr-2" />} label="AI Chat" onClick={() => setIsSidebarOpen(false)} />
              <MobileNavItem to="/image-upload" icon={<Image className="h-5 w-5 mr-2" />} label="Image Upload" onClick={() => setIsSidebarOpen(false)} />
              <MobileNavItem to="/tts" icon={<Volume2 className="h-5 w-5 mr-2" />} label="Text to Speech" onClick={() => setIsSidebarOpen(false)} />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
  >
    {icon}
    {label}
  </Link>
);

interface MobileNavItemProps extends NavItemProps {
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ to, icon, label, onClick }) => (
  <Link 
    to={to} 
    className="px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 flex items-center"
    onClick={onClick}
  >
    {icon}
    {label}
  </Link>
);

export default Header;
