import { FC, useEffect, useRef, useState } from "react";
import "./App.css";

const formattedSeconds = (sec: number) =>
  `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;

interface StopwatchProps {
  initialSeconds: number;
}

const Stopwatch: FC<StopwatchProps> = ({ initialSeconds }) => {
  const [secondsElapsed, setSecondsElapsed] = useState(initialSeconds);
  const [lastClearedIncrementer, setLastClearedIncrementer] = useState<
    number | undefined
  >(undefined);
  const [laps, setLaps] = useState<number[]>([]);
  const [timerRunning, setTimerRunning] = useState(false);
  const incrementer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (incrementer.current !== null) {
        clearInterval(incrementer.current);
      }
    };
  }, []);

  const handleStartClick = () => {
    setTimerRunning(true);
    incrementer.current = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
  };

  const handleStopClick = () => {
    if (incrementer.current !== null) {
      clearInterval(incrementer.current);
    }
    setLastClearedIncrementer(incrementer.current || undefined);
    setTimerRunning(false);
  };

  const handleResetClick = () => {
    if (incrementer.current !== null) {
      clearInterval(incrementer.current);
      incrementer.current = null;
    }
    setSecondsElapsed(initialSeconds);
    setTimerRunning(false);
    setLaps([]);
    setLastClearedIncrementer(undefined);
  };

  const handleLapClick = () => {
    setLaps((prev) => [...prev, secondsElapsed]);
  };

  const handleDeleteClick = (index: number) => {
    setLaps((prev) => prev.filter((_, i) => i !== index));
  };

  const shouldShowStartButton =
    (secondsElapsed === initialSeconds ||
      incrementer.current === lastClearedIncrementer) &&
    !timerRunning;

  return (
    <div className="stopwatch">
      <h1 className="stopwatch-timer">{formattedSeconds(secondsElapsed)}</h1>
      <StartStopButton
        shouldShowStartButton={shouldShowStartButton}
        handleStartClick={handleStartClick}
        handleStopClick={handleStopClick}
      />
      {timerRunning && incrementer.current !== lastClearedIncrementer && (
        <BaseButton onClick={handleLapClick}>lap</BaseButton>
      )}
      {!timerRunning && incrementer.current === lastClearedIncrementer && (
        <BaseButton onClick={handleResetClick}>reset</BaseButton>
      )}
      <div className="stopwatch-laps">
        {laps.map((lap, i) => (
          <Lap
            key={i}
            index={i + 1}
            lap={lap}
            onDelete={() => handleDeleteClick(i)}
          />
        ))}
      </div>
    </div>
  );
};

// Helper components

const BaseButton: FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button type="button" onClick={onClick}>
    {children}
  </button>
);

const StartStopButton: FC<{
  shouldShowStartButton: boolean;
  handleStartClick: () => void;
  handleStopClick: () => void;
}> = ({ shouldShowStartButton, handleStartClick, handleStopClick }) => (
  <BaseButton
    onClick={shouldShowStartButton ? handleStartClick : handleStopClick}
  >
    {shouldShowStartButton ? "start" : "stop"}
  </BaseButton>
);

const Lap: FC<{ index: number; lap: number; onDelete: () => void }> = ({
  index,
  lap,
  onDelete,
}) => (
  <div className="stopwatch-lap">
    <strong>{index}</strong>/ {formattedSeconds(lap)}{" "}
    <button onClick={onDelete}> X </button>
  </div>
);

export default Stopwatch;
