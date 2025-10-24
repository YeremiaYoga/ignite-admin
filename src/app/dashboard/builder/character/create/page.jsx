import { Suspense } from "react";
import CharacterFormPage from "../CharacterFormPage";

export default function CreatePage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <CharacterFormPage mode="create" />
    </Suspense>
  );
}