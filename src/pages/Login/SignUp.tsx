import { useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// --- Interfaces y Tipos ---

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Mapea las llaves de FormData a strings (mensajes de error)
type FormErrors = Partial<Record<keyof FormData, string>>;

// Mapea las llaves de FormData a booleanos
type TouchedState = Partial<Record<keyof FormData, boolean>>;

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedState>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Forzamos el tipado del name para que coincida con las claves de FormData
    const fieldName = name as keyof FormData;
    
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) validateField(fieldName, value);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, value);
  };

  const validateField = (name: keyof FormData, value: string) => {
    const newErrors: FormErrors = { ...errors };

    switch (name) {
      case 'nombre':
        if (!value.trim()) newErrors.nombre = 'El nombre es requerido';
        else if (value.trim().length < 2) newErrors.nombre = 'Mínimo 2 caracteres';
        else delete newErrors.nombre;
        break;
      case 'apellido':
        if (!value.trim()) newErrors.apellido = 'El apellido es requerido';
        else if (value.trim().length < 2) newErrors.apellido = 'Mínimo 2 caracteres';
        else delete newErrors.apellido;
        break;
      case 'email':
        {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!value) newErrors.email = 'El correo es requerido';
          else if (!emailRegex.test(value)) newErrors.email = 'Ingresa un correo válido';
          else delete newErrors.email;
          break;
        }
      case 'password':
        if (!value) newErrors.password = 'La contraseña es requerida';
        else if (value.length < 8) newErrors.password = 'Mínimo 8 caracteres';
        else if (!/(?=.*[a-z])/.test(value)) newErrors.password = 'Al menos una minúscula';
        else if (!/(?=.*[A-Z])/.test(value)) newErrors.password = 'Al menos una mayúscula';
        else if (!/(?=.*\d)/.test(value)) newErrors.password = 'Al menos un número';
        else delete newErrors.password;
        
        // Validar confirmación si ya fue tocada
        if (touched.confirmPassword && formData.confirmPassword) {
            if (value !== formData.confirmPassword) newErrors.confirmPassword = 'No coinciden';
            else delete newErrors.confirmPassword;
        }
        break;
      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Confirma tu contraseña';
        else if (value !== formData.password) newErrors.confirmPassword = 'No coinciden';
        else delete newErrors.confirmPassword;
        break;
      default: break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const allTouched: TouchedState = { nombre: true, apellido: true, email: true, password: true, confirmPassword: true };
    setTouched(allTouched);
    
    // Validación simple antes de enviar
    const hasErrors = Object.keys(errors).length > 0 || !formData.email || !formData.password;

    if (!hasErrors) {
      setLoading(true);
      setApiError('');
      setSuccessMessage('');

      const userData = {
        name: formData.nombre,
        lastname: formData.apellido,
        email: formData.email,
        password: formData.password
      };

      try {
        const response = await fetch('https://apimanacoffee-production.up.railway.app/user/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || data.error || 'Error en el registro');
        }

        console.log('Registro exitoso:', data);
        setSuccessMessage('¡Cuenta creada con éxito! Redirigiendo...');
        setFormData({ nombre: '', apellido: '', email: '', password: '', confirmPassword: '' });
        setTouched({});
        
        // Simulación de redirección
        setTimeout(() => {
             // window.location.href = '/login';
             console.log("Redirigiendo al login...");
        }, 2000);

      } catch (error: unknown) { // FIX: Usar 'unknown' en lugar de 'any' para el error
        console.error('Error al registrar:', error);
        
        let errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

        // Lógica de type narrowing para acceder de forma segura al mensaje
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error; // Por si se lanza un string
        }
        
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // --- CLASES COMUNES PARA INPUTS ---
  const inputClasses = (hasError: boolean | string | undefined) => `
    w-full px-4 py-3 rounded-lg outline-none transition duration-200
    text-base md:text-sm lg:text-base
    border
    ${hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-red-50'
      : 'border-gray-300 focus:border-amber-700 focus:ring-2 focus:ring-amber-100 bg-white hover:border-gray-400'
    }
  `;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4 sm:p-5 font-sans">
      
      <div className="bg-white rounded-2xl shadow-md sm:shadow-xl p-6 sm:p-10 w-full max-w-md transition-all duration-300 border border-gray-100">
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 sm:mb-8 text-center tracking-tight">
          Crear Cuenta
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  
          {/* Grid para Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="nombre" className="text-sm font-semibold text-gray-700 ml-1">Nombre</label>
              <input
                type="text" id="nombre" name="nombre" placeholder="Juan"
                value={formData.nombre} onChange={handleChange} onBlur={handleBlur}
                className={inputClasses(errors.nombre && touched.nombre)}
              />
              {errors.nombre && touched.nombre && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.nombre}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="apellido" className="text-sm font-semibold text-gray-700 ml-1">Apellido</label>
              <input
                type="text" id="apellido" name="apellido" placeholder="Pérez"
                value={formData.apellido} onChange={handleChange} onBlur={handleBlur}
                className={inputClasses(errors.apellido && touched.apellido)}
              />
              {errors.apellido && touched.apellido && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.apellido}</span>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-gray-700 ml-1">Correo Electrónico</label>
            <input
              type="email" id="email" name="email" placeholder="tu@ejemplo.com"
              value={formData.email} onChange={handleChange} onBlur={handleBlur}
              className={inputClasses(errors.email && touched.email)}
            />
             {errors.email && touched.email && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.email}</span>}
          </div>

          {/* Passwords */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} id="password" name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} onBlur={handleBlur}
                className={`${inputClasses(errors.password && touched.password)} pr-12`}
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-700 transition p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && touched.password && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.password}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 ml-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="••••••••"
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                className={`${inputClasses(errors.confirmPassword && touched.confirmPassword)} pr-12`}
              />
              <button
                type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-700 transition p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
             {errors.confirmPassword && touched.confirmPassword && <span className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.confirmPassword}</span>}
             {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && formData.password && (
              <span className="text-xs text-green-600 font-medium ml-1 flex items-center gap-1"><CheckCircle2 size={12}/> Coinciden</span>
            )}
          </div>

          {/* Botón de Submit */}
          <button 
            type="submit"
            disabled={loading || !!successMessage}
            className={`
              mt-2 w-full bg-gradient-to-r from-amber-700 to-amber-900 text-white px-6 py-3.5 rounded-xl font-bold text-base
              hover:from-amber-800 hover:to-amber-950 hover:shadow-lg
              focus:ring-4 focus:ring-amber-200 active:scale-[0.99]
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none
              transition-all duration-200 flex items-center justify-center gap-3
              ${successMessage ? 'bg-green-600 from-green-600 to-green-700' : ''}
            `}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Registrando...
              </>
            ) : successMessage ? (
                <>
                <CheckCircle2 className="h-5 w-5" />
                ¡Creado!
                </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>

        
          {/* Feedback Messages */}
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-4 text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{apiError}</p>
            </div>
          )}

          {successMessage && (
             <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md mt-4 text-sm flex items-start gap-3 animate-fadeIn">
               <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
               <p>{successMessage}</p>
             </div>
          )}

        <div className="mt-4 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-amber-700 font-bold hover:text-amber-900 transition hover:underline underline-offset-2">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
      {/* Estilos adicionales para animaciones */}
      <style>{`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-2px); }
            75% { transform: translateX(2px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}