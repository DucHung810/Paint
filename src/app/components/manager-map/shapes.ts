// useShapes.ts
import { useState, useEffect } from "react";
import { ShapeType } from "./enum";

const SHAPES_STORAGE_KEY = "draw-tool-shapes";

export interface Shape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  type: ShapeType;
  rotation: number;
  text: string;
}

export const useShapes = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const savedShapes = localStorage.getItem(SHAPES_STORAGE_KEY);
    if (savedShapes) {
      const initialShapes = JSON.parse(savedShapes);
      setShapes(initialShapes);
      setHistory([initialShapes]);
      setHistoryIndex(0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SHAPES_STORAGE_KEY, JSON.stringify(shapes));
  }, [shapes]);

  const updateShapes = (newShapes: Shape[], skipHistory = false) => {
    setShapes(newShapes);
    if (!skipHistory) {
      const newHistory = [...history.slice(0, historyIndex + 1), newShapes];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setShapes(history[prevIndex]);
      setHistoryIndex(prevIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setShapes(history[nextIndex]);
      setHistoryIndex(nextIndex);
    }
  };

  return {
    shapes,
    updateShapes,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
