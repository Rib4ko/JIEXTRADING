
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart2, 
  ShoppingCart, 
  User, 
  Book, 
  Settings, 
  FileText, 
  ChevronRight
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not authenticated or lacking permissions, redirect
  if (!user || user.role === 'client') {
    navigate('/');
    return null;
  }

  const isAdmin = user.role === 'admin';
  const isSeller = user.role === 'seller';
  
  // Get first letter of name for avatar
  const userInitial = user.name ? user.name.charAt(0) : user.email.charAt(0);

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground shadow-md hidden md:block">
        <div className="p-4">
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <span className="text-xl font-heading font-bold text-sahara-500">Jiex</span>
            <span className="text-xl font-heading font-bold">Trading</span>
          </Link>

          <nav>
            <ul className="space-y-1">
              <li>
                <Link 
                  to={`/${user.role}-dashboard`} 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                >
                  <BarChart2 className="h-5 w-5 mr-3 text-sahara-500" />
                  <span>Tableau de bord</span>
                </Link>
              </li>
              
              {isAdmin && (
                <>
                  <li>
                    <Link 
                      to="/admin-dashboard/sellers" 
                      className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                    >
                      <User className="h-5 w-5 mr-3 text-sahara-500" />
                      <span>Vendeurs</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/admin-dashboard/products" 
                      className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                    >
                      <FileText className="h-5 w-5 mr-3 text-sahara-500" />
                      <span>Tous les produits</span>
                    </Link>
                  </li>
                </>
              )}
              
              {isSeller && (
                <li>
                  <Link 
                    to="/seller-dashboard/products" 
                    className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                  >
                    <FileText className="h-5 w-5 mr-3 text-sahara-500" />
                    <span>Mes produits</span>
                  </Link>
                </li>
              )}
              
              <li>
                <Link 
                  to={`/${user.role}-dashboard/orders`} 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                >
                  <ShoppingCart className="h-5 w-5 mr-3 text-sahara-500" />
                  <span>Commandes</span>
                </Link>
              </li>
              
              <li>
                <Link 
                  to="/profile" 
                  className="flex items-center px-4 py-2 rounded-md hover:bg-sidebar-accent group"
                >
                  <Settings className="h-5 w-5 mr-3 text-sahara-500" />
                  <span>Paramètres</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-64 p-4 border-t border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-sahara-500 text-white flex items-center justify-center">
                {userInitial}
              </div>
              <div className="ml-2">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role}</p>
              </div>
            </div>
            <button 
              onClick={() => logout()} 
              className="text-sahara-500 hover:text-sahara-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Toggle and Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card shadow-sm z-10">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <button className="md:hidden mr-4 text-foreground focus:outline-none">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <h1 className="text-2xl font-heading font-semibold">{title}</h1>
            </div>
            
            <div className="md:hidden">
              <div className="relative">
                <button className="flex items-center space-x-1 text-foreground focus:outline-none">
                  <span className="h-8 w-8 rounded-full bg-sahara-500 text-white flex items-center justify-center">
                    {userInitial}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-background overflow-y-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
