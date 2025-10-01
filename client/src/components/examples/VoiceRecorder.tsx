import { VoiceRecorder } from "../VoiceRecorder";

export default function VoiceRecorderExample() {
  return (
    <div className="p-8 max-w-md">
      <VoiceRecorder onRecordingComplete={(blob) => console.log('Recording complete', blob)} />
    </div>
  );
}
