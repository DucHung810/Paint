import * as React from "react";
import "../style.css";
import { ToolbarDraw } from "../toolbar/toolbar";

export interface IAppProps {
  children: React.ReactNode;
  title: string;
}

export default function Wapper(props: IAppProps) {
  return (
    <div className="App flex flex-col w-full h-full ">
      <div className="flex h-[90px] justify-start items-center pt-4 pl-4 gap-3 border-b-1 border-b-[#c4c4c4]">
        <div className="w-[100px] h-[36px]">
          <img src="./img/oryza-logo.png" alt="oryza" />
        </div>
        <div>
          <h1 className="text-2xl text-gray-500">{props.title}</h1>
          <div className="flex flex-row gap-2">
            <p className="p-tool"> Flie</p>
            <p className="p-tool"> Edit</p>
            <p className="p-tool"> View</p>
            <p className="p-tool"> Help</p>
          </div>
          <ToolbarDraw
            onDeleteAll={function (): void {
              throw new Error("Function not implemented.");
            }}
            onDeleteSelected={function (): void {
              throw new Error("Function not implemented.");
            }}
            onUndo={function (): void {
              throw new Error("Function not implemented.");
            }}
            onRedo={function (): void {
              throw new Error("Function not implemented.");
            }}
            canUndo={false}
            canRedo={false}
            selectedIds={[]}
          />
        </div>
      </div>
      {props.children}
    </div>
  );
}
