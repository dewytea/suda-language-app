import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onSelect: (code: string) => void;
}

export function LanguageSelector({ selectedLanguage, onSelect }: LanguageSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {LANGUAGES.map((lang) => (
        <Card
          key={lang.code}
          className={`p-6 cursor-pointer hover-elevate active-elevate-2 transition-all relative ${
            selectedLanguage === lang.code ? "border-primary" : ""
          }`}
          onClick={() => onSelect(lang.code)}
          data-testid={`card-language-${lang.code}`}
        >
          {selectedLanguage === lang.code && (
            <div className="absolute top-2 right-2">
              <Check className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="text-center space-y-2">
            <div className="text-4xl">{lang.flag}</div>
            <div className="font-serif font-semibold text-base">{lang.name}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
