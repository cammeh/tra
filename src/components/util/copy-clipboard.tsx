import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";

const CopyToClipboard = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);

    // Reset copied state after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      className="flex gap-2 text-sm cursor-pointer hover:bg-gray-400"
      size={"sm"}
    >
      {copied ? (
        <Check className="w-2 h-2 text-green-500" />
      ) : (
        <Clipboard className="w-2 h-2" />
      )}
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
};

export default CopyToClipboard;
