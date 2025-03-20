import Image from "next/image";
import useCountdown from "@/hooks/useCountdown";

export default function FlashSale() {
  const handleFinish = () => {
    console.log("Flash Sale has ended!");
  };

  const timeLeft = useCountdown(2, 15, 30, handleFinish);

  return (
    <div className="relative mt-[90px] bg-gradient-to-r from-orange-500 to-red-600 text-white flex flex-col sm:flex-row items-center justify-center gap-4 py-4 px-6 shadow-lg rounded-md mx-4 flex-wrap">
      <div className="animate-[wiggle_0.5s_infinite]">
        <Image
          src="/bell.png"
          alt="Flash Sale"
          width={40}
          height={40}
          className="w-10 h-10"
          aria-label="Flash Sale Bell Icon"
        />
      </div>

      <h2 className="text-lg sm:text-2xl font-bold tracking-wide text-center sm:text-left">
        ⚡ Flash Sale - Limited Time Offer!
      </h2>

      <div
        className={`flex items-center gap-2 bg-white text-red-600 px-3 py-1 rounded-md font-semibold shadow-md ${
          timeLeft.hours === 0 &&
          timeLeft.minutes === 0 &&
          timeLeft.seconds === 0
            ? "animate-pulse"
            : ""
        }`}
      >
        ⏳ <span className="hidden sm:inline">Time Left:</span>{" "}
        <time
          dateTime={`PT${timeLeft.hours}H${timeLeft.minutes}M${timeLeft.seconds}S`}
        >
          {`${String(timeLeft.hours).padStart(2, "0")}:${String(
            timeLeft.minutes
          ).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
        </time>
      </div>
    </div>
  );
}
