import { useState } from 'react';
import type { FormEvent } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // NOTA: handleSubmit espera FormEvent, por eso debe ir en el onSubmit de la forma
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    const loginData = {
      email: email,
      password: password
    };

    try {
      const response = await fetch('https://apimanacoffee-production.up.railway.app/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        // Mostrar el mensaje de error de la API
        setError(data.detail || 'Error en el inicio de sesión');
        return;
      }

      console.log('Login exitoso:', data);
      
      // Simulación de acciones post-login
      // window.location.href = '/dashboard';
      
    } catch (error: unknown) { // Usamos 'unknown' para seguridad de tipos
      console.error('Error al iniciar sesión:', error);
      
      let errorMessage = 'Error de conexión. Por favor, intenta de nuevo.';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-5 font-sans">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 w-full max-w-md transition-all duration-300 border border-gray-100">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">
          Iniciar Sesión
        </h2>
        
        {/* FIX: Contenedor <form> que maneja el envío */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm flex items-start gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition hover:border-gray-400"
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 text-base border border-gray-300 rounded-lg outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100 transition hover:border-gray-400"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-amber-700 transition p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* El botón tiene type="submit" y dispara el onSubmit de la forma */}
          <button 
            type="submit" // Clave para disparar el onSubmit
            disabled={loading}
            className={`
              bg-gradient-to-r from-amber-700 to-amber-900 text-white px-6 py-3.5 text-base font-bold rounded-xl mt-3 
              hover:from-amber-800 hover:to-amber-950 hover:shadow-lg
              focus:ring-4 focus:ring-amber-200 active:scale-[0.99]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none
              transition-all duration-200 flex items-center justify-center gap-3
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Cargando...
              </>
            ) : (
              'Ingresar'
            )}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{' '}
            <a href="/signup" className="text-amber-700 font-bold hover:text-amber-900 transition hover:underline underline-offset-2">
              Créala aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}