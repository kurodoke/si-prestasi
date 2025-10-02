import { CheckIcon, PencilIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface EditableTitleProps {
    initialTitle: string;
    onSave: (newTitle: string) => void;
}

export default function EditableTitle({ initialTitle, onSave }: EditableTitleProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [tempTitle, setTempTitle] = useState(initialTitle);

    const startEditing = () => {
        setTempTitle(title);
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setTempTitle(title);
        setIsEditing(false);
    };

    const saveEditing = () => {
        setTitle(tempTitle);
        setIsEditing(false);
        onSave(tempTitle);
    };

    return (
        <div className="flex items-center gap-2">
            {!isEditing ? (
                <h1 className="w-full cursor-pointer font-bold select-none flex items-center gap-2" onDoubleClick={startEditing} title="Double click to edit">
                    {title} <PencilIcon className='size-4'/>
                </h1>
            ) : (
                <div className="flex w-full items-center gap-2">
                    <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        className="max-w-[200px] sm:max-w-full flex-grow border-b border-gray-300 bg-transparent text-2xl font-bold text-muted-foreground focus:border-blue-500 focus:outline-none"
                        autoFocus
                    />
                    <button onClick={saveEditing} aria-label="Save" className="p-1 text-green-600 hover:text-green-800" title="Save">
                        <CheckIcon size={20} />
                    </button>
                    <button onClick={cancelEditing} aria-label="Cancel" className="p-1 text-red-600 hover:text-red-800" title="Cancel">
                        <XIcon size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
