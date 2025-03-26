import { useCallback } from "react";
import DraggableItem from "./com-tool/draggable-item";
import { IMAGE_ITEMS, TOOL_ITEMS } from "./com-tool/list-item-tool";
// Import danh sách items

interface ToolboxProps {
  onUpdateColor: (color: string) => void;
  onUpdateText: (text: string) => void;
  textInput: string;
}

export const Toolbox = ({
  onUpdateColor,
  onUpdateText,
  textInput,
}: ToolboxProps) => {
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateColor(e.target.value);
    },
    [onUpdateColor]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onUpdateText(e.target.value);
    },
    [onUpdateText]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Render các shape cơ bản */}
      <div className="grid grid-cols-3 grid-rows-1 max-w-[150px] gap-2">
        {TOOL_ITEMS.map(({ type, className, icon }) => (
          <DraggableItem key={type} type={type} className={className}>
            {icon}
          </DraggableItem>
        ))}
      </div>

      {/* Render các hình ảnh */}
      <div className="grid grid-cols-3 grid-rows-1 max-w-[150px] gap-2">
        {IMAGE_ITEMS.map(({ type, src, alt }) => (
          <DraggableItem key={type} type={type} className="w-10 h-10">
            <img src={src} alt={alt} />
          </DraggableItem>
        ))}
      </div>

      {/* Chọn màu */}
      <div className="flex flex-row gap-2 items-center">
        <label className="text-gray-700 font-bold">Choose Color:</label>
        <input
          type="color"
          onChange={handleColorChange}
          className="w-6 h-6 cursor-pointer"
        />
      </div>

      {/* Nhập text */}
      <input
        type="text"
        value={textInput}
        onChange={handleTextChange}
        placeholder="Enter text"
        className=" border text-black p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500 max-w-[150px]"
      />
    </div>
  );
};
