import { X } from 'lucide-react';

interface TagProps {
  text: string;
  onRemove?: () => void;
}

export function Tag({ text, onRemove }: TagProps) {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-gray-100 rounded-full">
      <span>{text}</span>
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-gray-200 rounded-full transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
} 