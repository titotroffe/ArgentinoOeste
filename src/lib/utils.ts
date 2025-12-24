export function formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';

    // Ensure we handle YYYY-MM-DD correctly without timezone shifts
    // Appending T12:00:00 is a simple trick to avoid 00:00:00 becoming previous day in western hemispheres
    // when interpreted as UTC but displayed in local time.
    // However, explicit parsing is often safer.

    const parts = dateString.split('-');
    if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
        const day = parseInt(parts[2], 10);

        const date = new Date(year, month, day);

        return new Intl.DateTimeFormat('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }

    // Fallback for other formats
    return new Date(dateString).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
