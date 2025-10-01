import { SkillCard } from "@/components/SkillCard";
import { ScenarioCard } from "@/components/ScenarioCard";
import { Mic, BookOpen, Headphones, PenLine } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useState } from "react";
import heroImage from "@assets/generated_images/Language_learning_hero_image_466f9149.png";
import airportImage from "@assets/generated_images/Airport_scenario_background_e10f50e6.png";
import bankImage from "@assets/generated_images/Bank_scenario_background_57f59a83.png";
import schoolImage from "@assets/generated_images/School_scenario_background_7ea09a63.png";
import restaurantImage from "@assets/generated_images/Restaurant_scenario_background_35240a88.png";
import cinemaImage from "@assets/generated_images/Cinema_scenario_background_5615faa4.png";

export default function Dashboard() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const scenarios = [
    { title: "At the Airport", description: "Travel conversations", image: airportImage },
    { title: "At the Bank", description: "Financial transactions", image: bankImage },
    { title: "At School", description: "Academic discussions", image: schoolImage },
    { title: "At a Restaurant", description: "Dining conversations", image: restaurantImage },
    { title: "At the Cinema", description: "Entertainment talks", image: cinemaImage },
  ];

  return (
    <div className="space-y-12">
      <div className="relative h-[400px] md:h-[500px] -mx-8 -mt-8 mb-12">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20 z-10" />
        <img 
          src={heroImage} 
          alt="Language Learning" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <h1 className="font-serif font-bold text-4xl md:text-6xl text-white">
              Master Any Language
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              AI-powered learning with focus on speaking, reading, listening, and writing
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">Choose Your Language</h2>
        <LanguageSelector 
          selectedLanguage={selectedLanguage} 
          onSelect={setSelectedLanguage} 
        />
      </section>

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">Daily Practice</h2>
        <p className="text-muted-foreground">Complete your 1-hour daily goal across all skills</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SkillCard
            title="Speaking"
            icon={Mic}
            duration="30 min"
            progress={65}
            color="speaking"
            onClick={() => console.log("Speaking clicked")}
          />
          <SkillCard
            title="Reading"
            icon={BookOpen}
            duration="10 min"
            progress={40}
            color="reading"
            onClick={() => console.log("Reading clicked")}
          />
          <SkillCard
            title="Listening"
            icon={Headphones}
            duration="10 min"
            progress={80}
            color="listening"
            onClick={() => console.log("Listening clicked")}
          />
          <SkillCard
            title="Writing"
            icon={PenLine}
            duration="10 min"
            progress={55}
            color="writing"
            onClick={() => console.log("Writing clicked")}
          />
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-serif font-semibold text-3xl">Practice Scenarios</h2>
        <p className="text-muted-foreground">Learn practical conversations for real-life situations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.title}
              title={scenario.title}
              description={scenario.description}
              imageUrl={scenario.image}
              onClick={() => console.log(`${scenario.title} clicked`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
