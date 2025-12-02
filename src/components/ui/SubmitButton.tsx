import { Loader2, CheckCircle2 } from 'lucide-react';
import styles from '../../pages/signUp/SignUp.module.css';

interface SubmitButtonProps {
    loading: boolean;
    successMessage: string | null;
    buttonText: string;
    loadingText?: string;
    successText?: string;
}

const SubmitButton = ({
    loading,
    successMessage,
    buttonText,
    loadingText = 'Cargando...',
    successText = '¡Listo!'
}: SubmitButtonProps) => {
    const disabled = loading || !!successMessage;
    const className = successMessage ? styles.submitButtonSuccess : styles.submitButton;

    let content;
    if (loading) {
        content = (
            <>
                <Loader2 className="animate-spin h-5 w-5" />
                {loadingText}
            </>
        );
    } else if (successMessage) {
        content = (
            <>
                <CheckCircle2 className="h-5 w-5" />
                {successText}
            </>
        );
    } else {
        content = buttonText;
    }

    return (
        <button
            type="submit"
            disabled={disabled}
            className={className}
        >
            {content}
        </button>
    );
};

export default SubmitButton;