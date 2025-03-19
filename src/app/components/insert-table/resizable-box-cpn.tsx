"use client";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import { useState, useEffect, useRef } from "react";
import ConfirmDeleteDialog from "../dialog/confirm";

interface DraggableResizableBoxProps {
  storageKey: string;
  onDelete: () => void;
  initialPosition?: { x: number; y: number };
}

const ResizableBoxCpn: React.FC<DraggableResizableBoxProps> = ({
  storageKey,
  onDelete,
  initialPosition,
}) => {
  const POSITION_STORAGE_KEY = `${storageKey}-position`;
  const SIZE_STORAGE_KEY = `${storageKey}-size`;
  const TEXT_STORAGE_KEY = `${storageKey}-text`;
  const ROTATION_STORAGE_KEY = `${storageKey}-rotation`;

  const [size, setSize] = useState({ width: 50, height: 50 });
  // Sử dụng initialPosition nếu có, nếu không thì lấy từ localStorage hoặc mặc định
  const [position, setPosition] = useState(() => {
    const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
    return savedPosition
      ? JSON.parse(savedPosition)
      : initialPosition || { x: 0, y: 0 }; // Dùng initialPosition nếu được cung cấp
  });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [text, setText] = useState("Text");
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [rotation, setRotation] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [center, setCenter] = useState({ x: 0, y: 0 });

  const [click, setClick] = useState(false);
  const [hover, setHover] = useState(false);

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => setHover(false);

  const handleClick = () => {
    setClick((prev) => !prev);
  };
  // Load dữ liệu từ localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
    const savedSize = localStorage.getItem(SIZE_STORAGE_KEY);
    const savedText = localStorage.getItem(TEXT_STORAGE_KEY);
    const savedRotation = localStorage.getItem(ROTATION_STORAGE_KEY);

    if (savedSize) setSize(JSON.parse(savedSize));
    if (savedText) setText(savedText);
    if (savedRotation) setRotation(parseFloat(savedRotation));
    // Chỉ dùng savedPosition nếu không có initialPosition
    if (!initialPosition && savedPosition)
      setPosition(JSON.parse(savedPosition));
  }, [initialPosition]);

  const handleMouseDownRotate = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    if (rect) {
      setCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setRotating(true);
    e.preventDefault();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging && !rotating) {
        const newPosition = { x: e.clientX - start.x, y: e.clientY - start.y };
        setPosition(newPosition);
      }

      if (rotating && !dragging) {
        const angle = Math.atan2(e.clientY - center.y, e.clientX - center.x);
        const degree = (angle * 180) / Math.PI;
        setRotation(degree);
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
      localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(position));
      if (rotating) {
        setRotating(false);
        localStorage.setItem(ROTATION_STORAGE_KEY, rotation.toString());
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, start, position, rotating, center, rotation]);

  const handleResizeStop = (
    e: React.SyntheticEvent,
    data: { size: { width: number; height: number } }
  ) => {
    const newSize = { width: data.size.width, height: data.size.height };
    setSize(newSize);
    localStorage.setItem(SIZE_STORAGE_KEY, JSON.stringify(newSize));
  };

  const handleTextClick = () => {
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputBlur = () => {
    setEditing(false);
    localStorage.setItem(TEXT_STORAGE_KEY, text);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setText(e.target.value);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setEditing(false);
      localStorage.setItem(TEXT_STORAGE_KEY, text);
    }
  };

  return (
    <div
      className="absolute border border-blue-500 bg-blue-100 p-1 cursor-move"
      style={{
        left: position.x,
        top: position.y,
        transform: `rotate(${rotation}deg)`,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
     <ResizableBox
        width={size.width}
        height={size.height}
        axis="both"
        minConstraints={[50, 50]}
        className="border border-blue-500 bg-blue-100"
        onResizeStop={handleResizeStop}
        
      >
        <div
          onMouseDown={handleMouseDown}
          className="w-full h-full flex items-center justify-center relative"
        >
          {editing ? (
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="border p-1 w-full text-center"
            />
          ) : (
            <span onClick={handleTextClick} className="cursor-pointer">
              {text}
            </span>
          )}
        </div>
      </ResizableBox>

      {click && (
        <div
          className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
          onMouseDown={handleMouseDownRotate}
        >
          ⭮
        </div>
      )}
       {hover &&
      <div className="absolute -top-2 -right-1 ">
        <ConfirmDeleteDialog onDelete={onDelete} />
      </div> }  
    </div>
  );
};

export default ResizableBoxCpn;
