import { useState, useEffect } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { MapPin, AlertCircle } from 'lucide-react';

const QiblaCompass = () => {
    const { location, setLocation } = useSettings();
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
    const [compassHeading, setCompassHeading] = useState<number | null>(0);
    const [error, setError] = useState<string | null>(null);

    // 1. Get Location & Calculate Qibla Direction
    useEffect(() => {
        if (!location) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    (err) => {
                        setError('Location access required for Qibla. ' + err.message);
                    }
                );
            } else {
                setError('Geolocation not supported.');
            }
        } else {
            // Determine Qibla Angle relative to True North
            const qibla = calculateQibla(location.latitude, location.longitude);
            setQiblaDirection(qibla);
        }
    }, [location, setLocation]);

    // 2. Compass Heading Listener (DeviceOrientation)
    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            let heading: number | null = null;

            // iOS
            if ((event as any).webkitCompassHeading) {
                heading = (event as any).webkitCompassHeading;
            }
            // Android / Standard (alpha is degrees around z axis, 0 is tricky without magnetometer fusion)
            // Note: Absolute orientation API is preferred but fallback to alpha
            else if (event.alpha !== null) {
                // Alpha is 0 at north? Not always.
                // For simplicity in web compasses without absolute-orientation sensor, we often rely on iOS or warn user.
                // Assuming standard alpha is relative to north if calibrated.
                heading = 360 - event.alpha;
            }

            if (heading !== null) {
                setCompassHeading(heading);
            }
        };

        // Request permission for iOS 13+
        const requestAccess = async () => {
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                try {
                    const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', handleOrientation);
                    } else {
                        setError('Compass permission denied.');
                    }
                } catch (e) {
                    console.error(e);
                }
            } else {
                // Non-iOS 13+
                window.addEventListener('deviceorientation', handleOrientation);
            }
        };

        requestAccess();
        return () => window.removeEventListener('deviceorientation', handleOrientation);
    }, []);

    const calculateQibla = (lat: number, lng: number) => {
        const KAABA_LAT = 21.4225;
        const KAABA_LNG = 39.8262;

        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const toDeg = (rad: number) => (rad * 180) / Math.PI;

        const phi1 = toRad(lat);
        const phi2 = toRad(KAABA_LAT);
        const deltaL = toRad(KAABA_LNG - lng);

        const y = Math.sin(deltaL);
        const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaL);

        let qibla = toDeg(Math.atan2(y, x));
        return (qibla + 360) % 360;
    };


    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-xl font-bold">Compass Error</h3>
                <p className="text-gray-500">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    if (qiblaDirection === null) {
        return (
            <div className="flex bg-white dark:bg-slate-900 h-[50vh] items-center justify-center rounded-2xl">
                <div className="text-center space-y-4">
                    <Spinner size="lg" />
                    <p className="text-gray-500">Calculating Qibla Direction...</p>
                </div>
            </div>
        );
    }


    return (
        <div className="max-w-md mx-auto space-y-8 py-4">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold font-serif text-gray-800 dark:text-white">Qibla Compass</h1>
                <p className="text-gray-500 dark:text-gray-400">Align arrow for Qibla direction</p>
            </div>

            <Card className="flex flex-col items-center justify-center py-12 relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-950">
                <div className="relative w-72 h-72 rounded-full border-4 border-gray-200 dark:border-slate-700 shadow-2xl flex items-center justify-center bg-white dark:bg-slate-900">
                    {/* Compass Dial markings */}
                    <div className="absolute inset-0 rounded-full border border-gray-100 dark:border-slate-800 opacity-50"></div>
                    <span className="absolute top-4 text-xs font-bold text-gray-400">N</span>
                    <span className="absolute bottom-4 text-xs font-bold text-gray-400">S</span>
                    <span className="absolute left-4 text-xs font-bold text-gray-400">W</span>
                    <span className="absolute right-4 text-xs font-bold text-gray-400">E</span>

                    {/* The Compass Needle (Rotates opposite to heading) */}
                    <div
                        className="w-full h-full absolute transition-transform duration-300 ease-out will-change-transform"
                        style={{ transform: `rotate(${- (compassHeading || 0)}deg)` }}
                    >
                        {/* Static Qibla Indicator relative to North */}
                        <div
                            className="absolute w-1 h-32 bg-emerald-500 left-1/2 -translate-x-1/2 bottom-1/2 origin-bottom rounded-t-full shadow-[0_0_15px_rgba(16,185,129,0.5)] z-20 flex flex-col items-center justify-start pt-2"
                            style={{ transform: `rotate(${qiblaDirection}deg)` }}
                        >
                            <div className="w-8 h-8 -mt-10 bg-emerald-600 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Central Pivot */}
                    <div className="w-4 h-4 bg-gray-300 dark:bg-slate-600 rounded-full z-30 border-2 border-white dark:border-slate-900"></div>
                </div>

                <div className="mt-8 text-center space-y-1">
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {Math.round(qiblaDirection)}°
                    </p>
                    <p className="text-xs uppercase tracking-wider text-gray-400">Qibla Angle</p>
                </div>
            </Card>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <MapPin size={16} />
                <span>{location ? `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}` : 'Detecting Location...'}</span>
            </div>

            <p className="text-xs text-center text-gray-400 max-w-xs mx-auto">
                Note: Compass accuracy depends on your device hardware. Move device in a figure-8 motion to calibrate.
            </p>
        </div>
    );
};

export default QiblaCompass;
