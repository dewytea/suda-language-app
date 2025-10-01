import { ReadingContent } from "../ReadingContent";

export default function ReadingContentExample() {
  return (
    <div className="p-8 max-w-3xl">
      <ReadingContent
        title="The Little Prince"
        content="Once when I was six years old I saw a magnificent picture in a book about the primeval forest. It was a picture of a boa constrictor swallowing an animal."
        translation="내가 여섯 살이었을 때, 원시림에 관한 책에서 멋진 그림을 보았습니다. 그것은 보아뱀이 동물을 삼키는 그림이었습니다."
      />
    </div>
  );
}
