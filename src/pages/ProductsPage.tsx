import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import MainLayout from '../components/layouts/MainLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { 
  Card, 
  CardContent 
} from '../components/ui/card';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Grid, 
  List 
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useOrders } from "../context/OrderContext";
import { toast } from "@/hooks/use-toast";

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { products, loading, searchProducts } = useProducts();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { placeOrder } = useOrders();

  const searchParams = new URLSearchParams(location.search);
  const initialQuery = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(false);

  const categories = Array.from(
    new Set(
      products.flatMap(product => product.keywords)
    )
  ).sort();

  useEffect(() => {
    let results = products;
    
    if (searchQuery) {
      results = searchProducts(searchQuery);
    }
    
    if (activeCategory) {
      results = results.filter(product =>
        product.keywords.some(keyword => 
          keyword.toLowerCase() === activeCategory.toLowerCase()
        )
      );
    }
    
    results = results.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    setFilteredProducts(results);
  }, [searchQuery, products, activeCategory, priceRange, searchProducts]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeCategory) params.set('category', activeCategory);
    
    navigate({ search: params.toString() }, { replace: true });
  }, [searchQuery, activeCategory, navigate]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category === activeCategory ? '' : category);
  };

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    addToCart(product, 1);
    toast({
      title: "Ajouté au panier!",
      description: `${product.title} ajouté au panier.`,
      variant: "default"
    });
  };

  return (
    <MainLayout>
      <div className="sahara-container">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-grow max-w-xl">
              <Input
                type="text"
                placeholder="Rechercher des pièces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600" />
            </form>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <div className="border border-blue-300 rounded-md hidden md:flex">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-blue-600 hover:bg-blue-50'}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="md:hidden bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 animate-fade-in">
              <h3 className="font-medium mb-3 text-blue-800">Catégories</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    className={`cursor-pointer ${
                      activeCategory === category 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'border-blue-300 text-blue-700 hover:bg-blue-50'
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              
              <h3 className="font-medium mb-3 text-blue-800">Gamme de Prix</h3>
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                  className="w-24 border-blue-300"
                />
                <span className="text-blue-600">à</span>
                <Input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                  className="w-24 border-blue-300"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="hidden md:block w-64 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 h-fit sticky top-20 shadow-lg">
              <h3 className="font-medium mb-3 text-blue-800">Catégories</h3>
              <div className="flex flex-col space-y-2 mb-6">
                {categories.map((category) => (
                  <div 
                    key={category}
                    className={`cursor-pointer p-2 rounded-md transition-all ${
                      activeCategory === category 
                        ? 'bg-blue-200 text-blue-900 font-medium shadow-sm' 
                        : 'hover:bg-blue-100 text-blue-700'
                    }`}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
              
              <h3 className="font-medium mb-3 text-blue-800">Gamme de Prix</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-20 border-blue-300"
                  />
                  <span className="text-blue-600">à</span>
                  <Input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-20 border-blue-300"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              {loading ? (
                <div className={`grid ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'} gap-6`}>
                  {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-blue-200">
                      <div className={`h-48 bg-blue-100 ${viewMode === 'list' ? 'hidden sm:block sm:w-48' : 'w-full'}`}></div>
                      <CardContent className="p-4">
                        <div className="h-4 bg-blue-100 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-blue-100 rounded w-1/2 mb-4"></div>
                        <div className="h-6 bg-blue-100 rounded w-1/3"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className={`grid ${viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'} gap-6`}>
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className={`product-card group ${viewMode === 'list' ? 'sm:flex' : ''}`}>
                      <div className={viewMode === 'list' ? 'hidden sm:block sm:w-48 flex-shrink-0' : ''}>
                        <img 
                          src={product.imageUrl} 
                          alt={product.title} 
                          className={`product-image h-48 object-cover transition-transform duration-300 group-hover:scale-105 ${viewMode === 'list' ? 'w-48' : 'w-full'}`}
                        />
                      </div>
                      <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-medium text-lg mb-1 truncate">
                          <Link to={`/products/${product.id}`} className="hover:text-blue-600 text-blue-800">
                            {product.title}
                          </Link>
                        </h3>
                        <p className={`text-muted-foreground text-sm mb-3 ${viewMode === 'list' ? '' : 'line-clamp-2'}`}>
                          {product.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-blue-700">
                            {product.price.toFixed(2)} MAD
                          </span>
                          <div className="flex space-x-2">
                            <Button asChild variant="outline" size="sm" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                              <Link to={`/products/${product.id}`}>
                                Voir
                              </Link>
                            </Button>
                            <Button 
                              onClick={() => handleAddToCart(product)} 
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <ShoppingCart className="h-4 w-4 mr-1" />
                              Ajouter
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-2xl font-heading font-semibold mb-2 text-blue-800">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mb-6">
                    Essayez d'ajuster vos critères de recherche ou de filtre
                  </p>
                  <Button onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('');
                    setPriceRange({ min: 0, max: 1000 });
                  }} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Effacer Tous les Filtres
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductsPage;
