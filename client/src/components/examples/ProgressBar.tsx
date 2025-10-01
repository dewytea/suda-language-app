import { ProgressBar } from "../ProgressBar";

export default function ProgressBarExample() {
  return (
    <div className="p-8 space-y-6 max-w-md">
      <ProgressBar value={75} label="Speaking Progress" />
      <ProgressBar value={40} label="Reading Progress" />
      <ProgressBar value={90} label="Overall Progress" />
    </div>
  );
}
