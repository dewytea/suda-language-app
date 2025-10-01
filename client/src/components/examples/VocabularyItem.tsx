import { VocabularyItem } from "../VocabularyItem";

export default function VocabularyItemExample() {
  return (
    <div className="p-8 max-w-md">
      <VocabularyItem
        word="magnificent"
        translation="멋진, 훌륭한"
        example="It was a magnificent view from the top."
        onDelete={() => console.log('Delete word')}
      />
    </div>
  );
}
