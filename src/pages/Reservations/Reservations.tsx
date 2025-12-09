import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Users, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';
import Header from '../../components/layout/Header/Header';
import styles from './Reservations.module.css';

export default function Reservations() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [numberOfPeople, setNumberOfPeople] = useState('');
    const [reason, setReason] = useState('');
    // Reservation time/type: 'time' = specific HH:mm, 'full' = restaurante completo
    const [reservationType, setReservationType] = useState<'time' | 'full'>('time');
    const [timeValue, setTimeValue] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [contactError, setContactError] = useState('');
    type ReservationRecord = {
        date: string;
        dateFormatted: string;
        numberOfPeople: number;
        reason: string;
        timestamp: string;
        timestampFormatted: string;
        reservationType: 'time' | 'full';
        time?: string | null;
        name?: string;
        email?: string;
        phone?: string;
    };

    const [tempReservationData, setTempReservationData] = useState<ReservationRecord | null>(null);

    // --- Helpers to persist and read reservations locally (used for availability checks) ---
    const STORAGE_KEY = 'mc_reservations';

    const loadReservations = (): ReservationRecord[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return [];
            return JSON.parse(raw) as ReservationRecord[];
        } catch (err) {
            console.error('Error reading reservations from storage', err);
            return [];
        }
    };

    const saveReservationToStorage = (reservation: ReservationRecord) => {
        try {
            const list = loadReservations();
            list.push(reservation);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (err) {
            console.error('Error saving reservation to storage', err);
        }
    };

    const isAvailable = (newRes: ReservationRecord): { ok: boolean; message?: string } => {
        const existing = loadReservations();

        const newDateOnly = new Date(newRes.date).toDateString();

        const hasFullOnDate = existing.some((r) => r.reservationType === 'full' && new Date(r.date).toDateString() === newDateOnly);
        if (hasFullOnDate) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };

        if (newRes.reservationType === 'full') {
            const anyOnDate = existing.some((r) => new Date(r.date).toDateString() === newDateOnly);
            if (anyOnDate) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };
            return { ok: true };
        }

        // (no 'allday' option: only 'time' or 'full')

        // specific time
        const time = newRes.time || '';
        const totalForTime = existing.reduce((sum: number, r) => {
            if (new Date(r.date).toDateString() !== newDateOnly) return sum;
            if (r.reservationType === 'full') return sum + 35;
            if (r.time === time) return sum + (Number(r.numberOfPeople) || 0);
            return sum;
        }, 0);

        if (totalForTime + Number(newRes.numberOfPeople) > 35) return { ok: false, message: 'Sin cupo. Comunícate al WhatsApp.' };
        return { ok: true };
    };

    // Generate selectable 1-hour intervals starting every 30 minutes from 07:00,
    // including only those whose end time is <= 21:00. Returns value and label.
    const generateIntervals = () => {
        const intervals: { value: string; label: string; start: string; end: string }[] = [];
        const open = 7 * 60; // minutes
        const close = 21 * 60; // minutes
        const lastStart = close - 60; // last start so that end <= close
        for (let m = open; m <= lastStart; m += 30) {
            const startMin = m;
            const endMin = m + 60;
            if (endMin > close) continue;
            const pad = (n: number) => String(n).padStart(2, '0');
            const start = `${pad(Math.floor(startMin / 60))}:${pad(startMin % 60)}`;
            const end = `${pad(Math.floor(endMin / 60))}:${pad(endMin % 60)}`;

            const fmt = (hhmm: string) => {
                const [h, mm] = hhmm.split(':').map(Number);
                const d = new Date();
                d.setHours(h, mm, 0, 0);
                return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
            };

            const label = `${fmt(start)} – ${fmt(end)}`;
            intervals.push({ value: `${start}-${end}`, label, start, end });
        }
        return intervals;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setContactError('');

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

        if (reservationType === 'time' && !timeValue) {
            setError('Por favor selecciona la hora de la reservación');
            return;
        }

        // Guardar datos temporales y mostrar modal
        const reservationData: ReservationRecord = {
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
            timestampFormatted: new Date().toLocaleString('es-ES'),
            reservationType: reservationType,
            time: reservationType === 'time' ? timeValue || null : null
        };

        setTempReservationData(reservationData);
        setShowContactModal(true);
    };

    const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setContactError('');

        // Validar nombre
        if (!name.trim()) {
            setContactError('Por favor ingresa tu nombre');
            return;
        }

        // Validar email
        if (!email.trim()) {
            setContactError('Por favor ingresa tu correo electrónico');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setContactError('Por favor ingresa un correo electrónico válido');
            return;
        }

        // Validar teléfono
        if (!phone.trim()) {
            setContactError('Por favor ingresa tu número celular');
            return;
        }

        setLoading(true);

        try {
            // Combinar datos de reservación con datos de contacto
            const completeReservationData: ReservationRecord = {
                ...(tempReservationData as ReservationRecord),
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim()
            };

            // Check availability against stored reservations
            const availability = isAvailable(completeReservationData);
            if (!availability.ok) {
                setContactError(availability.message || 'Sin cupo. Comunícate al WhatsApp.');
                setLoading(false);
                return;
            }

            // Create filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `reservation_${timestamp}.json`;

            console.log('Reservación completa:', completeReservationData);
            console.log('Sería guardada en:', `public/data/reservations/${filename}`);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            // Persist to localStorage (so availability checks work)
            try {
                saveReservationToStorage(completeReservationData);
            } catch (err) {
                console.warn('No se pudo guardar localmente', err);
            }

            // Show success message
            setSuccess(true);

            // Reset all form
            setSelectedDate(undefined);
            setNumberOfPeople('');
            setReason('');
            setName('');
            setEmail('');
            setPhone('');
            setShowContactModal(false);
            setTempReservationData(null);

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (err) {
            console.error('Error saving reservation:', err);
            setContactError('Error al guardar la reservación. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        if (!loading) {
            setShowContactModal(false);
            setName('');
            setEmail('');
            setPhone('');
            setContactError('');
            setTempReservationData(null);
        }
    };

    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.content}>
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

                        {/* Time / Full options moved under calendar (left side) */}
                        <div className={styles.fieldContainer}>
                            <label className={styles.label}>
                                <FileText size={18} className={styles.labelIcon} />
                                Hora de Reservación
                            </label>

                            <div className={styles.radioGroup}>
                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="reservationType"
                                        value="time"
                                        checked={reservationType === 'time'}
                                        onChange={() => setReservationType('time')}
                                    />
                                    Hora específica
                                </label>

                                {reservationType === 'time' && (
                                    <select
                                        id="timeInterval"
                                        aria-label="Hora de la reservación"
                                        value={timeValue}
                                        onChange={(e) => { setTimeValue(e.target.value); setReservationType('time'); }}
                                        className={styles.input}
                                        required
                                    >
                                        <option value="">Selecciona un intervalo</option>
                                        {generateIntervals().map((it) => (
                                            <option key={it.value} value={it.value}>{it.label}</option>
                                        ))}
                                    </select>
                                )}

                                <label className={styles.radioLabel}>
                                    <input
                                        type="radio"
                                        name="reservationType"
                                        value="full"
                                        checked={reservationType === 'full'}
                                        onChange={() => setReservationType('full')}
                                    />
                                    Reservar restaurante completo
                                </label>
                            </div>

                        </div>
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
                                        Confirmar
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal para datos de contacto */}
            {showContactModal && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Información de Contacto</h2>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={loading}
                                className={styles.closeButton}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {contactError && (
                            <div className={styles.errorAlert}>
                                <AlertCircle className={styles.alertIcon} />
                                <p>{contactError}</p>
                            </div>
                        )}

                        <form onSubmit={handleContactSubmit} className={styles.contactForm}>
                            <div className={styles.fieldContainer}>
                                <label htmlFor="name" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Nombre Completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                    placeholder="Tu nombre"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="email" className={styles.label}>
                                    <FileText size={18} className={styles.labelIcon} />
                                    Correo Electrónico *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="tu@correo.com"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.fieldContainer}>
                                <label htmlFor="phone" className={styles.label}>
                                    <Users size={18} className={styles.labelIcon} />
                                    Número Celular *
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={styles.input}
                                    placeholder="+57 123 456 7890"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={loading}
                                    className={styles.cancelButton}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
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
                                            Realizar Reserva
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
