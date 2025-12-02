import { useState } from 'react';
import { sendEmail, sendCode, updatePassword } from '../lib/API';

const STATES = {
    PHASE_1_ENTRY: 'PHASE_1_ENTRY',
    PHASE_2_ENTRY: 'PHASE_2_ENTRY',
    PHASE_3_PASSWORD_RESET: 'PHASE_3_PASSWORD_RESET',
    VERIFICATION_COMPLETE: 'VERIFICATION_COMPLETE',
    LOADING: 'LOADING'
};
type Message = { text: string; type: 'success' | 'error' } | null;

const usePasswordReset = () => {
    const [appState, setAppState] = useState(STATES.PHASE_1_ENTRY);
    const [message, setMessage] = useState<Message>(null);
    const [inputPhase1, setInputPhase1] = useState('');
    const [inputPhase2, setInputPhase2] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async () => {
        
        if (appState === STATES.LOADING) return;

        setAppState(STATES.LOADING);
        setMessage(null);
        let nextState = appState;
        let nextMessage: Message = null;

        switch (appState) {
            case STATES.PHASE_1_ENTRY:
                try {
                    await sendEmail({
                        email: inputPhase1.trim()
                    });

                    nextMessage = { 
                        text: 'Código enviado.', 
                        type: 'success' 
                    };
                    nextState = STATES.PHASE_2_ENTRY; 

                } catch (error: unknown) {
                    nextState = STATES.PHASE_1_ENTRY;
                    let errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    } else if (typeof error === 'string') {
                        errorMessage = error;
                    }

                    nextMessage = { 
                        text: errorMessage, 
                        type: 'error' 
                    };
                } 
            break;

            case STATES.PHASE_2_ENTRY:
                try {
                    await sendCode({
                        email: inputPhase1.trim(),
                        code: inputPhase2.trim() 
                    });

                    nextMessage = { 
                        text: 'Código valido.', 
                        type: 'success' 
                    };
                    nextState = STATES.PHASE_3_PASSWORD_RESET; 

                } catch (error: unknown) {
                    nextState = STATES.PHASE_2_ENTRY;
                    let errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    } else if (typeof error === 'string') {
                        errorMessage = error;
                    }

                    nextMessage = { 
                        text: errorMessage, 
                        type: 'error' 
                    };         
                } 
            break;

            case STATES.PHASE_3_PASSWORD_RESET:
                try {
                    await updatePassword({
                        password: newPassword.trim()
                    });

                    nextMessage = { 
                        text: 'Código valido.', 
                        type: 'success' 
                    };
                    nextState = STATES.VERIFICATION_COMPLETE; 

                } catch (error: unknown) {
                    nextState = STATES.PHASE_3_PASSWORD_RESET;
                    let errorMessage = 'Ocurrió un error inesperado. Intenta nuevamente.';

                    if (error instanceof Error) {
                        errorMessage = error.message;
                    } else if (typeof error === 'string') {
                        errorMessage = error;
                    }

                    nextMessage = { 
                        text: errorMessage, 
                        type: 'error' 
                    };                
                }
            break;

            default:
                nextState = STATES.PHASE_1_ENTRY;
        }

        setAppState(nextState);
        setMessage(nextMessage);
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return {
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
    };
};

export default usePasswordReset;