
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "Erreur 404 : L'utilisateur a tenté d'accéder à une route inexistante :",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="text-center max-w-md p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-xl border border-blue-200">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">404</h1>
        <p className="text-xl text-gray-700 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link 
          to="/products" 
          className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Retour aux Produits
        </Link>
        <p className="mt-4 text-sm text-gray-600">
          Si vous pensez qu'il s'agit d'une erreur, veuillez contacter notre équipe de support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
