import { Metadata } from "@components/metadata";
import { ModerationPage } from "@features/moderation";

export default function Moderation() {
  return (
    <>
      <Metadata title="Moderacja" canonical="/moderation" />
      <ModerationPage />
    </>
  );
}
