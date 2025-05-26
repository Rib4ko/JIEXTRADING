import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Button } from './button';
import { Input } from './input';
import { ShoppingCart, User, Search, FileText, Settings, Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';

  console.log('Navbar - Current user:', user);
  console.log('Navbar - User role:', user?.role);
  console.log('Navbar - Is admin:', isAdmin);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    logout()
      .catch((error) => {
        console.error("Error during logout:", error);
      })
      .finally(() => {
        // The redirect is now handled in the logout function itself
        // We don't reset isLoggingOut since we're navigating away
      });
  };

  const userMenuDropdown = (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl overflow-hidden z-20 hidden group-hover:block border border-blue-200">
      {/* Admin Dashboard link - prioritized at top */}
      {isAdmin && (
        <Link 
          to="/admin-dashboard" 
          className="block px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center font-medium border-b border-red-100"
        >
          <Shield className="h-4 w-4 mr-2" />
          Admin Dashboard
        </Link>
      )}
      {/* Other dashboard links */}
      {user?.role !== 'client' && !isAdmin && (
        <Link 
          to={`/${user?.role}-dashboard`} 
          className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
        >
          Tableau de Bord
        </Link>
      )}
      {isSeller && (
        <Link 
          to="/seller-dashboard/products" 
          className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
        >
          Gestion Produits
        </Link>
      )}
      <Link 
        to="/profile" 
        className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
      >
        Profil
      </Link>
      <Link 
        to="/orders" 
        className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
      >
        Commandes
      </Link>
      <button 
        onClick={handleLogout} 
        disabled={isLoggingOut}
        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
      >
        {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
      </button>
    </div>
  );

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-heading font-bold text-blue-200 group-hover:text-white transition-colors">Jiex</span>
            <span className="text-2xl font-heading font-bold ml-1 group-hover:text-blue-200 transition-colors">Trading</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/products" className="hover:text-blue-300 transition-colors font-medium">Produits</Link>
            {/* Admin Dashboard link in main nav for better visibility */}
            {isAdmin && (
              <Link to="/admin-dashboard" className="hover:text-red-300 transition-colors flex items-center font-medium bg-red-600/20 px-3 py-1 rounded-md">
                <Shield className="h-4 w-4 mr-1" />
                Admin Dashboard
              </Link>
            )}
            {isSeller && (
              <Link to="/seller-dashboard/products" className="hover:text-blue-300 transition-colors flex items-center font-medium">
                <FileText className="h-4 w-4 mr-1" />
                Gestion Produits
              </Link>
            )}
            <Link to="/about" className="hover:text-blue-300 transition-colors font-medium">À Propos</Link>
            <Link to="/contact" className="hover:text-blue-300 transition-colors font-medium">Contact</Link>
          </nav>

          {/* Search, Cart, and User Actions (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input 
                type="text" 
                placeholder="Rechercher des pièces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-4 py-2 bg-blue-700/60 border-blue-600 text-white placeholder:text-blue-300 w-48 focus:w-64 transition-all focus:bg-blue-600/60"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
            </form>

            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative group">
                  <ShoppingCart className="h-6 w-6 text-white hover:text-blue-300 transition-colors" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                      {totalItems}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <Button variant="ghost" className="flex items-center space-x-2 text-white hover:text-blue-300 hover:bg-blue-700/50">
                    <User className="h-5 w-5" />
                    <span>{user?.name || 'Utilisateur'}</span>
                    {isAdmin && <Shield className="h-4 w-4 text-red-300" />}
                  </Button>
                  {userMenuDropdown}
                </div>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:text-blue-300 hover:bg-blue-700/50">
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link to="/register">Inscription</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden focus:outline-none hover:text-blue-300 transition-colors" 
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block animate-fade-in' : 'hidden'} mt-4`}>
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Rechercher des pièces..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-4 py-2 bg-blue-700/60 border-blue-600 text-white placeholder:text-blue-300"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
            </div>
          </form>
          
          <nav className="flex flex-col space-y-3">
            <Link to="/products" className="py-2 hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>Produits</Link>
            
            {/* Admin Dashboard in mobile - prominent placement */}
            {isAdmin && (
              <Link 
                to="/admin-dashboard" 
                className="py-2 flex items-center hover:text-red-300 font-medium bg-red-600/20 px-3 rounded-md" 
                onClick={() => setIsMenuOpen(false)}
              >
                <Shield className="h-5 w-5 mr-2" />
                Admin Dashboard
              </Link>
            )}
            
            <Link to="/about" className="py-2 hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>À Propos</Link>
            <Link to="/contact" className="py-2 hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>Contact</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="py-2 flex items-center hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Panier {totalItems > 0 && `(${totalItems})`}
                </Link>
                
                {user?.role !== 'client' && !isAdmin && (
                  <Link 
                    to={`/${user?.role}-dashboard`} 
                    className="py-2 hover:text-blue-300 font-medium" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Tableau de Bord
                  </Link>
                )}
                
                {isSeller && (
                  <Link 
                    to="/seller-dashboard/products" 
                    className="py-2 flex items-center hover:text-blue-300 font-medium" 
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Gestion Produits
                  </Link>
                )}
                
                <Link to="/profile" className="py-2 hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>Profil</Link>
                <Link to="/orders" className="py-2 hover:text-blue-300 font-medium" onClick={() => setIsMenuOpen(false)}>Commandes</Link>
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut}
                  className="py-2 text-left text-red-400 hover:text-red-300 font-medium"
                >
                  {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
                </button>
              </>
            ) : (
              <div className="flex space-x-2 pt-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:text-blue-300 hover:bg-blue-700/50">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>Inscription</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
