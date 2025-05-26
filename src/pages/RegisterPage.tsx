
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

const RegisterPage: React.FC = () => {
  const { register, loading, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect if already authed
    if (user) {
      if (user.role === "client") navigate("/", { replace: true });
      if (user.role === "seller") navigate("/seller-dashboard", { replace: true });
      if (user.role === "admin") navigate("/admin-dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    const ok = await register(form.name, form.email, form.password);
    if (ok) {
      // Success toast shown in register
    } else {
      setError("Échec de l'inscription");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <Card className="border-sahara-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-heading text-center">Inscription</CardTitle>
            <CardDescription className="text-center">
              Créez un compte pour commencer à acheter ou vendre des pièces
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Votre nom"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="votre.email@exemple.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Au moins 8 caractères"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-sahara-600 hover:bg-sahara-700"
                disabled={loading}
              >
                {loading ? "Inscription..." : "S'inscrire"}
              </Button>
            </form>
            <div className="pt-3 text-center">
              <span className="text-sm text-muted-foreground">
                Vous avez déjà un compte ?{" "}
                <a href="/login" className="text-sahara-600 hover:text-sahara-700 font-medium">Se connecter</a>
              </span>
            </div>
          </CardContent>
          <CardFooter />
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
