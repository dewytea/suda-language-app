import { useState } from "react";
import { LanguageSelector } from "../LanguageSelector";

export default function LanguageSelectorExample() {
  const [selected, setSelected] = useState("en");
  
  return (
    <div className="p-8">
      <LanguageSelector 
        selectedLanguage={selected} 
        onSelect={(code) => {
          console.log('Language selected:', code);
          setSelected(code);
        }} 
      />
    </div>
  );
}
