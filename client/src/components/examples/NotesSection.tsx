import { NotesSection } from "../NotesSection";

export default function NotesSectionExample() {
  return (
    <div className="p-8 max-w-md">
      <NotesSection
        initialNotes="Remember to practice pronunciation"
        onSave={(notes) => console.log('Notes saved:', notes)}
      />
    </div>
  );
}
