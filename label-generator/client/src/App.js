import React from "react";
import { GenerateLabel } from "./components";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <img className="mt-4 ml-4" src="./logo.png" alt="aris" />
      </div>
      <GenerateLabel />
    </div>
  );
}

export default App;
