import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StickyNote, Save } from "lucide-react";
import { useState } from "react";

interface NotesSectionProps {
  initialNotes?: string;
  onSave: (notes: string) => void;
}

export function NotesSection({ initialNotes = "", onSave }: NotesSectionProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    console.log("Notes saved:", notes);
  };

  return (
    <Card className="p-6 space-y-4" data-testid="card-notes">
      <div className="flex items-center gap-2">
        <StickyNote className="h-5 w-5 text-yellow-500" />
        <h3 className="font-semibold">Notes</h3>
      </div>
      <Textarea
        placeholder="Add your notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-32 resize-none"
        data-testid="textarea-notes"
      />
      <Button onClick={handleSave} className="w-full" data-testid="button-save-notes">
        <Save className="h-4 w-4 mr-2" />
        {saved ? "Saved!" : "Save Notes"}
      </Button>
    </Card>
  );
}
