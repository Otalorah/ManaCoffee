import usePasswordReset from '../../hooks/usePasswordReset'
import { Send, Check, Lock, Loader2 } from 'lucide-react';
import StandardInput from '../../components/ui/StandardInput';
import PasswordInput from '../../components/ui/PasswordInput';
import { useSignUpForm } from '../../hooks/useSignUpForm';
import styles from '../SignUp/SignUp.module.css';
import type { ChangeEvent } from 'react';

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

const STATES = {
    PHASE_1_ENTRY: 'PHASE_1_ENTRY',
    PHASE_2_ENTRY: 'PHASE_2_ENTRY',
    PHASE_3_PASSWORD_RESET: 'PHASE_3_PASSWORD_RESET',
    VERIFICATION_COMPLETE: 'VERIFICATION_COMPLETE',
    LOADING: 'LOADING'
};

// ============================================================================
// COMPONENTE: MessageBox
// ============================================================================

const MessageBox = ({ message }: { message: { type: string; text: string } | null }) => {
    if (!message) return null;

    const baseClasses = "mb-6 p-4 rounded-lg text-sm transition-opacity duration-300 ease-in-out";
    let colorClasses = '';

    switch (message.type) {
        case 'success':
            colorClasses = 'bg-green-50 text-green-800 border-l-4 border-green-600';
            break;
        case 'error':
            colorClasses = 'bg-red-50 text-red-800 border-l-4 border-red-600';
            break;
        case 'info':
            colorClasses = 'bg-amber-50 text-amber-800 border-l-4 border-amber-600';
            break;
        default:
            colorClasses = 'bg-white-100 text-gray-100';
            break;
    }

    return (
        <div className={`${baseClasses} ${colorClasses}`} role="alert">
            {message.text}
        </div>
    );
};

// ============================================================================
// COMPONENTE: ProgressStep
// ============================================================================

const ProgressStep = ({ number, label, completed, active }: { number: string; label: string; completed: boolean; active: boolean }) => {
    const getStepClasses = () => {
        if (completed) return 'bg-green-600 text-white';
        if (active) return 'bg-[#d46c11] text-white';
        return 'bg-[#d4c4b0] text-[#4a3b32]';
    };

    const getStepTextClasses = () => {
        if (completed) return 'text-green-600';
        if (active) return 'text-[#d46c11]';
        return 'text-[#9b8570]';
    };

    const getStepIcon = () => {
        return completed ? <Check className="w-4 h-4" /> : number;
    };

    return (
        <div className="text-center w-1/3">
            <div className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full font-semibold mb-1 ${getStepClasses()}`}>
                {getStepIcon()}
            </div>
            <span className={`text-xs font-medium ${getStepTextClasses()}`}>{label}</span>
        </div>
    );
};

// ============================================================================
// COMPONENTE: ProgressBar
// ============================================================================

const ProgressBar = ({ appState }: { appState: string }) => {
    const step1Completed = appState === STATES.PHASE_2_ENTRY ||
        appState === STATES.PHASE_3_PASSWORD_RESET ||
        appState === STATES.VERIFICATION_COMPLETE;
    const step2Active = appState === STATES.PHASE_2_ENTRY;
    const step2Completed = appState === STATES.PHASE_3_PASSWORD_RESET ||
        appState === STATES.VERIFICATION_COMPLETE;
    const step3Active = appState === STATES.PHASE_3_PASSWORD_RESET;
    const step3Completed = appState === STATES.VERIFICATION_COMPLETE;

    return (
        <div className="flex justify-between items-center mb-8">
            <ProgressStep
                number="1"
                label="Identificación"
                completed={step1Completed}
                active={appState === STATES.PHASE_1_ENTRY}
            />

            <div className="flex-grow h-0.5 bg-[#d4c4b0] self-center mx-1"></div>

            <ProgressStep
                number="2"
                label="Código Verificación"
                completed={step2Completed}
                active={step2Active}
            />

            <div className="flex-grow h-0.5 bg-[#d4c4b0] self-center mx-1"></div>

            <ProgressStep
                number="3"
                label="Nueva Contraseña"
                completed={step3Completed}
                active={step3Active}
            />
        </div>
    );
};

// ============================================================================
// COMPONENTE: Phase1Form
// ============================================================================

const Phase1Form = ({ value, onChange, onKeyPress, disabled }: { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void; disabled: boolean }) => {
    return (
        <div className="space-y-4 mb-6 transition duration-300">
            <StandardInput
                id="input-phase-1"
                label="Ingrese Correo Electrónico"
                type="text"
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                placeholder="ejemplo@dominio.com"
                disabled={disabled}
            />
        </div>
    );
};

// ============================================================================
// COMPONENTE: Phase2Form
// ============================================================================

const Phase2Form = ({ value, onChange, onKeyPress, disabled }: { value: string; onChange: (e: ChangeEvent<HTMLInputElement>) => void; onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void; disabled: boolean }) => {
    return (
        <div className="space-y-4 mb-6 transition duration-300">
            <StandardInput
                id="input-phase-2"
                label="Ingrese el código"
                type="text"
                maxLength={6}
                value={value}
                onChange={onChange}
                onKeyPress={onKeyPress}
                placeholder="------"
                disabled={disabled}
                className="text-center text-2xl tracking-widest"
            />
        </div>
    );
};

// ============================================================================
// COMPONENTE: Phase3Form
// ============================================================================

const Phase3Form = ({
    onNewPasswordChange,
}: {
    newPassword: string;
    onNewPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    disabled: boolean
}) => {

    const {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
    } = useSignUpForm(() => {
        console.log("Redirigiendo al login...");
        // navigate('/login');
    });

    const handleChange2 = (e: ChangeEvent<HTMLInputElement>) => {
        onNewPasswordChange(e);
        handleChange(e);
    };

    return (
        <div className="space-y-4 mb-6 transition duration-300">
            {/* Password */}
            <PasswordInput
                label="Contraseña"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange2}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                isConfirm={false}
            />

            {/* Confirm Password */}
            <PasswordInput
                label="Confirmar Contraseña"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                isConfirm={true} // Parámetro para habilitar el mensaje de éxito "Coinciden"
            />
        </div>
    );
};

// ============================================================================
// COMPONENTE: SubmitButton
// ============================================================================

const SubmitButton = ({ appState, onClick, disabled }: { appState: string; onClick: () => void; disabled: boolean }) => {
    const getButtonConfig = () => {
        if (appState === STATES.LOADING) {
            return {
                text: 'Procesando...',
                icon: <Loader2 className="animate-spin w-5 h-5 mr-2" />,
                classes: 'bg-gray-400 cursor-not-allowed'
            };
        }

        switch (appState) {
            case STATES.PHASE_1_ENTRY:
                return {
                    text: 'Enviar código',
                    icon: <Send className="w-5 h-5 mr-2" />,
                    classes: 'bg-[#d46c11] hover:bg-[#c05e0f]'
                };
            case STATES.PHASE_2_ENTRY:
                return {
                    text: 'Confirmar',
                    icon: <Check className="w-5 h-5 mr-2" />,
                    classes: 'bg-[#d46c11] hover:bg-[#c05e0f]'
                };
            case STATES.PHASE_3_PASSWORD_RESET:
                return {
                    text: 'Establecer nueva contraseña',
                    icon: <Lock className="w-5 h-5 mr-2" />,
                    classes: 'bg-[#d46c11] hover:bg-[#c05e0f]'
                };
            default:
                return {
                    text: 'Continuar',
                    icon: null,
                    classes: 'bg-[#d46c11] hover:bg-[#c05e0f]'
                };
        }
    };

    const { text, icon, classes } = getButtonConfig();

    return (
        <button
            onClick={onClick}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-lg transition duration-200 ease-in-out flex justify-center items-center ${classes}`}
            disabled={disabled}
        >
            {icon}
            {text}
        </button>
    );
};

// ============================================================================
// COMPONENTE: SuccessMessage
// ============================================================================

const SuccessMessage = () => {
    return (
        <div className="mt-8 text-center p-6 bg-green-50 border-l-4 border-green-600 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700 mb-2">¡Proceso Finalizado!</h2>
            <p className="text-green-600">Su contraseña ha sido restablecida con éxito.</p>
        </div>
    );
};

// ============================================================================
// COMPONENTE PRINCIPAL: App
// ============================================================================

const App = () => {
    const {
        appState,
        message,
        inputPhase1,
        setInputPhase1,
        inputPhase2,
        setInputPhase2,
        newPassword,
        setNewPassword,
        handleSubmit,
        handleKeyPress
    } = usePasswordReset();

    const buttonDisabled = appState === STATES.LOADING;

    const step1Completed = appState === STATES.PHASE_2_ENTRY ||
        appState === STATES.PHASE_3_PASSWORD_RESET ||
        appState === STATES.VERIFICATION_COMPLETE;
    const step2Completed = appState === STATES.PHASE_3_PASSWORD_RESET ||
        appState === STATES.VERIFICATION_COMPLETE;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className="text-3xl font-bold mb-6 text-[#6f4e37] text-center">
                    Recuperación de Contraseña
                </h1>

                <MessageBox message={message} />

                <ProgressBar appState={appState} />

                {appState !== STATES.VERIFICATION_COMPLETE && (
                    <div>
                        {appState === STATES.PHASE_1_ENTRY && (
                            <Phase1Form
                                value={inputPhase1}
                                onChange={(e) => setInputPhase1(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={buttonDisabled}
                            />
                        )}

                        {step1Completed && appState === STATES.PHASE_2_ENTRY && (
                            <Phase2Form
                                value={inputPhase2}
                                onChange={(e) => setInputPhase2(e.target.value.replace(/[^0-9]/g, ''))}
                                onKeyPress={handleKeyPress}
                                disabled={buttonDisabled}
                            />
                        )}

                        {step2Completed && appState === STATES.PHASE_3_PASSWORD_RESET && (
                            <Phase3Form
                                newPassword={newPassword}
                                onNewPasswordChange={(e) => setNewPassword(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={buttonDisabled}
                            />
                        )}

                        <SubmitButton
                            appState={appState}
                            onClick={handleSubmit}
                            disabled={buttonDisabled}
                        />
                    </div>
                )}

                {appState === STATES.VERIFICATION_COMPLETE && <SuccessMessage />}
            </div>
        </div>
    );
};

export default App;