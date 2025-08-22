"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, LogIn, Building2, UserPlus } from "lucide-react";

const demoAccounts = [
  {
    role: "ADMIN",
    label: "Administrateur",
    email: "admin@chantierpro.fr",
    password: "admin123",
    color: "from-red-500 to-red-600",
    description: "Accès complet à toutes les fonctionnalités"
  },
  {
    role: "COMMERCIAL", 
    label: "Commercial",
    email: "commercial@chantierpro.fr",
    password: "commercial123",
    color: "from-green-500 to-green-600",
    description: "Gestion clients, devis et chantiers"
  },
  {
    role: "CLIENT",
    label: "Client",
    email: "client@example.fr", 
    password: "client123",
    color: "from-blue-500 to-blue-600",
    description: "Vue sur ses chantiers et messages"
  }
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (success ) {
       router.push("/dashboard");
     } else {
       setError("Email ou mot de passe incorrect");
     }
   } catch (err) {
     setError("Erreur de connexion");
   } finally {
     setLoading(false);
   }
 };

 const handleQuickLogin = (account: typeof demoAccounts[0]) => {
   setEmail(account.email);
   setPassword(account.password);
 };

 return (
   <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
     <div className="absolute inset-0 overflow-hidden">
       <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
       <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
       <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
     </div>

     <div className="relative w-full max-w-md">
       <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
         
         <div className="text-center mb-8">
           <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
             <Building2 size={32} className="text-white" />
           </div>
           <h1 className="text-3xl font-bold text-white mb-2">ChantierPro</h1>
           <p className="text-blue-200">Connexion à votre espace</p>
         </div>

         <form onSubmit={handleLogin} className="space-y-6">
           {error && (
             <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 text-red-200 text-sm text-center">
               {error}
             </div>
           )}

           <div className="space-y-4">
             <div>
               <label htmlFor="email" className="block text-sm font-medium text-blue-200 mb-2">
                 Email
               </label>
               <input
                 id="email"
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                 placeholder="votre@email.fr"
                 required
               />
             </div>

             <div>
               <label htmlFor="password" className="block text-sm font-medium text-blue-200 mb-2">
                 Mot de passe
               </label>
               <div className="relative">
                 <input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 pr-12"
                   placeholder="••••••••"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                 >
                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                 </button>
               </div>
             </div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
           >
             {loading ? (
               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
             ) : (
               <>
                 <LogIn size={20} />
                 <span>Se connecter</span>
               </>
             )}
           </button>
         </form>

         <div className="mt-8 border-t border-white/20 pt-6">
           <p className="text-center text-blue-200 text-sm mb-4">Comptes de démonstration :</p>
           <div className="space-y-3">
             {demoAccounts.map((account) => (
               <button
                 key={account.role}
                 onClick={() => handleQuickLogin(account)}
                 className={`w-full text-left px-4 py-3 bg-gradient-to-r ${account.color} bg-opacity-20 border border-white/10 rounded-xl text-white hover:bg-opacity-30 transition-all duration-300`}
               >
                 <div className="flex justify-between items-center mb-1">
                   <span className="font-semibold">{account.label}</span>
                   <span className="text-xs opacity-75">{account.email}</span>
                 </div>
                 <p className="text-xs text-blue-200">{account.description}</p>
               </button>
             ))}
           </div>
         </div>

         <div className="mt-6 text-center space-y-4">
           <p className="text-blue-300 text-xs">
             Cliquez sur un compte ci-dessus pour vous connecter automatiquement
           </p>
           
           <div className="border-t border-white/20 pt-4">
             <p className="text-blue-200 text-sm mb-3">
               Vous n'avez pas encore de compte ?
             </p>
             <Link
               href="/auth/register"
               className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
             >
               <UserPlus size={20} />
               Créer un compte
             </Link>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
