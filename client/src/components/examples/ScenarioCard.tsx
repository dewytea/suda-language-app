import { ScenarioCard } from "../ScenarioCard";
import airportImage from "@assets/generated_images/Airport_scenario_background_e10f50e6.png";

export default function ScenarioCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <ScenarioCard
        title="At the Airport"
        description="Learn travel conversations"
        imageUrl={airportImage}
        onClick={() => console.log('Airport scenario clicked')}
      />
    </div>
  );
}
