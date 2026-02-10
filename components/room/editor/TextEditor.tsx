import Card from "@/components/ui/Card";

export default function TextEditor({
  text,
  isReadOnly,
  isOwner,
  onChange,
}: {
  text: string;
  isReadOnly: boolean;
  isOwner: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <Card>
      <textarea
        value={text}
        disabled={isReadOnly && !isOwner}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-[60vh] p-4 font-mono rounded resize-none transition
          ${
            isReadOnly && !isOwner
              ? "bg-neutral-800 text-neutral-400 cursor-not-allowed"
              : "bg-neutral-900"
          }
        `}
      />
    </Card>
  );
}
