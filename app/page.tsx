import Test from "./components/Test";
import WordsList from "./components/WordsList";

export default function Home() {
  return (
    <div>
      <WordsList languageId={2} />
    </div>
  );
}
