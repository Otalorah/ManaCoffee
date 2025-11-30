import { useState } from 'react';
import type { FormEvent } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Calendar as CalendarIcon, Users, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Reservations.module.css';

export default function Reservations() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        // Validation
        if (!selectedDate) {
            setError('Por favor selecciona una fecha para tu reservación');
            return;
        }

        const peopleCount = parseInt(numberOfPeople);
        if (isNaN(peopleCount) || peopleCount < 1 || peopleCount > 35) {
            setError('El número de personas debe estar entre 1 y 35');
            return;
        }

        if (!reason.trim()) {
            setError('Por favor indica la razón de tu reservación');
            return;
        }

        setLoading(true);

        try {
            // Create reservation data
            const reservationData = {
                date: selectedDate.toISOString(),
                dateFormatted: selectedDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                numberOfPeople: peopleCount,
                reason: reason.trim(),
                timestamp: new Date().toISOString(),
                timestampFormatted: new Date().toLocaleString('es-ES')
            };

            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `reservation_${timestamp}.json`;

            // In a real application, this would be sent to a backend API
            // For now, we'll log it and show success
            console.log('Reservation data:', reservationData);
            console.log('Would save to:', `public/data/reservations/${filename}`);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show success message
            setSuccess(true);

            // Reset form
            setSelectedDate(undefined);
            setNumberOfPeople('');
            setReason('');

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Error saving reservation:', err);
            setError('Error al guardar la reservación. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <button
                    onClick={() => navigate('/')}
                    className={styles.backButton}
                    type="button"
                    aria-label="Volver a la página principal"
                >
                    <ArrowLeft size={24} />
                </button>

                <div className={styles.header}>
                    <h1 className={styles.title}>Reservaciones</h1>
                    <p className={styles.subtitle}>
                        Reserva tu espacio en Mana Coffee. Selecciona una fecha y completa el formulario.
                    </p>
                </div>

                {success && (
                    <div className={styles.successAlert}>
                        <CheckCircle className={styles.alertIcon} />
                        <div>
                            <p className={styles.alertTitle}>¡Reservación exitosa!</p>
                            <p className={styles.alertText}>
                                Tu reservación ha sido guardada. Nos pondremos en contacto contigo pronto.
                            </p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle className={styles.alertIcon} />
                        <p>{error}</p>
                    </div>
                )}

                <div className={styles.mainContent}>
                    <div className={styles.calendarSection}>
                        <div className={styles.sectionHeader}>
                            <CalendarIcon className={styles.sectionIcon} />
                            <h2 className={styles.sectionTitle}>Selecciona una Fecha</h2>
                        </div>
                        <div className={styles.calendarContainer}>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className={styles.calendar}
                            />
                        </div>
                        {selectedDate && (
                            <div className={styles.selectedDateDisplay}>
                                <p className={styles.selectedDateLabel}>Fecha seleccionada:</p>
                                <p className={styles.selectedDateValue}>
                                    {selectedDate.toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.sectionHeader}>
                            <FileText className={styles.sectionIcon} />
                            <h2 className={styles.sectionTitle}>Detalles de la Reservación</h2>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.fieldContainer}>
                                <label htmlFor="numberOfPeople" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Número de Personas
                                </label>
                                <input
                                    type="number"
                                    id="numberOfPeople"
                                    value={numberOfPeople}
                                    onChange={(e) => setNumberOfPeople(e.target.value)}
                                    className={styles.input}
                                    placeholder="Ej: 10"
                                    min="1"
                                    max="35"
                                    required
                                />
                                <p className={styles.fieldHint}>Máximo 35 personas</p>
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="reason" className={styles.label}>
                                    <FileText size={18} className={styles.labelIcon} />
                                    Razón de la Reservación
                                </label>
                                <textarea
                                    id="reason"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className={styles.textarea}
                                    placeholder="Ej: Reunión de equipo, celebración de cumpleaños, evento corporativo..."
                                    rows={5}
                                    required
                                />
                                <p className={styles.fieldHint}>
                                    Cuéntanos sobre tu evento para preparar el mejor servicio
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !selectedDate}
                                className={styles.submitButton}
                            >
                                {loading ? (
                                    <>
                                        <div className={styles.spinner} />
                                        Guardando...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Confirmar Reservación
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
