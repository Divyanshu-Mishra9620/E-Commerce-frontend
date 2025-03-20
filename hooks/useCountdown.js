"use client";
import { useState, useEffect, useCallback } from "react";

const useCountdown = (initialHours, initialMinutes, initialSeconds) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  const updateTimer = useCallback(() => {
    setTimeLeft((prev) => {
      const { hours, minutes, seconds } = prev;
      if (seconds > 0) {
        return { ...prev, seconds: seconds - 1 };
      } else if (minutes > 0) {
        return { hours, minutes: minutes - 1, seconds: 59 };
      } else if (hours > 0) {
        return { hours: hours - 1, minutes: 59, seconds: 59 };
      } else {
        return { hours: 0, minutes: 0, seconds: 0 };
      }
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [updateTimer]);

  return timeLeft;
};

export default useCountdown;
