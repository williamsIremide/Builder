import { useEffect, useState } from "react";

export interface UserLocation {
  lat: number;
  lng: number;
}

interface UseUserLocationOptions {
  watch?: boolean; // default false (one-time fetch)
}

export function useUserLocation(options: UseUserLocationOptions = {}) {
  const { watch = false } = options;

  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      setLoading(false);
    };

    const onError = (err: GeolocationPositionError) => {
      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError("Permission denied.");
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location unavailable.");
          break;
        case err.TIMEOUT:
          setError("Request timed out.");
          break;
        default:
          setError("Unknown error.");
      }
      setLoading(false);
    };

    let watchId: number;

    if (watch) {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      });
    } else {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      });
    }

    return () => {
      if (watch && watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watch]);

  return { location, error, loading };
}
