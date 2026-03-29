import { Button } from "@components/button";
import { CopyIcon, SparklesIcon } from "lucide-react";

interface Props {
  isGenerating: boolean;
  isLoadingEvents: boolean;
  hasContent: boolean;
  isDisabled: boolean;
  onCopy: () => void;
  onGenerate: () => void;
}

const FacebookPostActions = ({
  hasContent,
  isDisabled,
  isGenerating,
  isLoadingEvents,
  onCopy,
  onGenerate,
}: Props) => {
  return (
    <div className="flex flex-wrap justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        icon={<CopyIcon />}
        onClick={onCopy}
        disabled={!hasContent}
      >
        Kopiuj
      </Button>
      <Button
        type="button"
        icon={<SparklesIcon />}
        onClick={onGenerate}
        isLoading={isGenerating}
        disabled={isGenerating || isLoadingEvents || isDisabled}
        loadingText="Generowanie posta..."
      >
        Generuj post
      </Button>
    </div>
  );
};

export { FacebookPostActions };
