import React, { useState, useEffect } from 'react';
import { useQibla } from '../hooks/useQibla';
import { Compass, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

const Qibla = () => {
    const { qiblaDirection, loading, error } = useQibla();
    const [deviceHeading, setDeviceHeading] = useState(0);
    const [isCompassSupported, setIsCompassSupported] = useState(false);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
                // alpha is the compass direction the device is facing
                // 360 - alpha is typically the magnetic north heading
                setDeviceHeading(360 - event.alpha);
            }
        };

        if (window.DeviceOrientationEvent) {
            // Request permission for iOS 13+ devices
            if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
                setIsCompassSupported(true);
            } else {
                window.addEventListener('deviceorientation', handleOrientation, true);
                setIsCompassSupported(true);
            }
        }

        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const requestAccess = () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((response: string) => {
                    if (response === 'granted') {
                        window.addEventListener('deviceorientation', (e) => {
                            if (e.alpha !== null) setDeviceHeading(360 - e.alpha);
                        }, true);
                    }
                })
                .catch(console.error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg">Retry</button>
            </div>
        );
    }

    // Calculate rotation: We want the Qibla pointer to point to Qibla.
    // If device is facing North (0), Qibla pointer should be at `qiblaDirection`.
    // If device rotates, everything rotates opposite to keep North up, but we want Compass UI where needle points to Qibla.
    // Ideally: Compass Card rotates with `deviceHeading`. Qibla Needle fixed at `qiblaDirection` relative to North.
    // So relative to device: `qiblaDirection - deviceHeading`.

    // const needleRotation = qiblaDirection ? qiblaDirection - deviceHeading : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center space-y-8 min-h-[60vh]"
        >
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Qibla Compass</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    {isCompassSupported
                        ? "Align the arrow with the Kaaba icon"
                        : "Compass not supported on this device/browser. Showing bearing relative to North."}
                </p>
                {isCompassSupported && typeof (DeviceOrientationEvent as any).requestPermission === 'function' && deviceHeading === 0 && (
                    <button onClick={requestAccess} className="mt-2 text-xs bg-gray-200 px-2 py-1 rounded">Enable Compass</button>
                )}
            </div>

            <div className="relative w-72 h-72 md:w-96 md:h-96">
                {/* Compass Rose (Background) - Rotates with device */}
                <div
                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-full shadow-2xl border-4 border-gray-100 dark:border-slate-800 flex items-center justify-center transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(${-deviceHeading}deg)` }}
                >
                    <div className="absolute top-4 text-gray-400 font-bold text-xl">N</div>
                    <div className="absolute bottom-4 text-gray-400 font-bold text-xl">S</div>
                    <div className="absolute right-4 text-gray-400 font-bold text-xl">E</div>
                    <div className="absolute left-4 text-gray-400 font-bold text-xl">W</div>

                    {/* Tick marks */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-gray-200 w-1 h-3 top-2 origin-bottom transform"
                            style={{ transform: `rotate(${i * 30}deg) translateY(0px)` }} // Simplified geometry
                        ></div>
                    ))}

                    {/* Qibla Marker on the Dial */}
                    {qiblaDirection !== null && (
                        <div
                            className="absolute w-1 h-1/2 bg-transparent top-0 origin-bottom transform flex flex-col items-center justify-start pt-8"
                            style={{ transform: `rotate(${qiblaDirection}deg)` }}
                        >
                            <div className="flex flex-col items-center">
                                <div className="text-emerald-600 font-bold text-2xl">🕋</div>
                                <div className="w-1 h-3 bg-emerald-500 rounded-full mt-1"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Center Element (User) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-md z-10"></div>
                    <div className="w-0.5 h-16 bg-red-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full origin-bottom"></div> {/* Fixed North pointer if needed, or just let the dial rotate */}
                </div>
            </div>

            <div className="text-center p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
                <p className="text-sm text-gray-500 uppercase tracking-wider">Qibla Direction</p>
                <h2 className="text-4xl font-bold text-emerald-600 mt-2">
                    {qiblaDirection ? qiblaDirection.toFixed(2) : '--'}°
                </h2>
                <p className="text-sm text-gray-400 mt-1">from North</p>
            </div>
        </motion.div>
    );
};

export default Qibla;
