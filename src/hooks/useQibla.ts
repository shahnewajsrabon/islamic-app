import { useState, useEffect } from 'react';

export const useQibla = () => {
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const KAABA_LAT = 21.422487;
    const KAABA_LONG = 39.826206;

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const bearing = calculateQibla(latitude, longitude);
                setQiblaDirection(bearing);
                setLoading(false);
            },
            (_err) => {
                setError('Unable to retrieve your location');
                setLoading(false);
            }
        );
    }, []);

    const calculateQibla = (latitude: number, longitude: number) => {
        const phiK = (KAABA_LAT * Math.PI) / 180.0;
        const lambdaK = (KAABA_LONG * Math.PI) / 180.0;
        const phi = (latitude * Math.PI) / 180.0;
        const lambda = (longitude * Math.PI) / 180.0;

        const y = Math.sin(lambdaK - lambda);
        const x = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda);

        let qibla = Math.atan2(y, x);
        qibla = (qibla * 180.0) / Math.PI;

        return (qibla + 360) % 360;
    };

    return { qiblaDirection, error, loading };
};
