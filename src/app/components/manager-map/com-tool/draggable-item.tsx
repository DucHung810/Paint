// components/DraggableItem.tsx
import React from "react";

interface DraggableItemProps {
  type: string;
  className: string;
  children?: React.ReactNode;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  type,
  className,
  children,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("type", type)}
      className={`cursor-move ${className}`}
    >
      {children}
    </div>
  );
};

export default DraggableItem;
