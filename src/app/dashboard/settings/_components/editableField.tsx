import SpinLoader from "@/ui/loaders/spinLoader";
import { useState } from "react";
import { BiCheck, BiEdit } from "react-icons/bi";

interface EditableFieldProps {
  label: string;
  value?: string;
  editableField: string;
  onSave?: (value: string, field: string) => Promise<boolean>;
  placeholder?: string;
  className?: string;
  loading?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value = "",
  placeholder = "Enter value...",
  className = "",
  onSave,
  editableField,
  loading,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value);

  const handleEdit = () => {
    setInputValue(value || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    const isSaved = await onSave?.(inputValue, editableField);
    console.log({isSaved});
    
    if (isSaved) {
      setIsEditing(false);
    }
  };

  const handleCancel = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setInputValue(value || "");
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex-1">
        <p className="text-2xl text-black font-semibold mb-1">{label}</p>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              handleCancel(e);
              handleKeyPress(e);
            }}
            placeholder={placeholder}
            className="min-w-2 px-3 py-2 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#5D5D5D]"
            autoFocus
          />
        ) : (
          <p className="text-[#5D5D5D]">{value || "No value set"}</p>
        )}
      </div>

      {isEditing ? (
        <button
          onClick={handleSave}
          className="flex gap-2 items-center cursor-pointer px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white border border-blue-500 rounded-lg transition-colors"
        >
          {loading ? (
            <SpinLoader />
          ) : (
            <>
              <BiCheck size={20} /> Save
            </>
          )}
        </button>
      ) : (
        <button
          onClick={handleEdit}
          className="flex gap-2 items-center cursor-pointer px-3 py-2 bg-white hover:text-blue-500 text-[#434343] border border-[#E4EAF5] rounded-lg hover:border-blue-500 transition-colors"
        >
          <BiEdit size={20} /> Edit
        </button>
      )}
    </div>
  );
};

export default EditableField;
