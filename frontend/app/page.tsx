"use client"; // Required for using useState & useEffect in App Router

import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
    const [apiKey, setApiKey] = useState("");
    const [prompt, setPrompt] = useState("");
    const [plantUMLCode, setPlantUMLCode] = useState("");
    const [diagramURL, setDiagramURL] = useState("");

    const saveApiKey = () => {
        localStorage.setItem("openai_api_key", apiKey);
        toast.success("API Key saved!");
    };

    const generatePlantUML = async () => {
        if (!prompt) return toast.error("Please enter a SQL schema or use case!");

        try {
            const response = await axios.post("http://localhost:5001/generate-plantuml", { prompt });
            setPlantUMLCode(response.data.plantUMLCode);
            generateDiagram(response.data.plantUMLCode);
        } catch (error) {
            console.error(error);
            toast.error("Error generating PlantUML!");
        }
    };

    const generateDiagram = async (plantUMLCode: string) => {
        try {
            const response = await axios.post("http://localhost:5001/generate-diagram", { plantUMLCode });
            setDiagramURL(response.data.diagramURL);
        } catch (error) {
            console.error(error);
            toast.error("Error generating ER diagram!");
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-300 p-6">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6 text-white">ER Diagram Generator</h1>

            {/* API Key Input */}
            <div className="mb-6 flex items-center space-x-2">
                <input
                    type="text"
                    placeholder="Enter OpenAI API Key"
                    className="p-2 w-96 border border-gray-700 bg-gray-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                />
                <button 
                    onClick={saveApiKey} 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded shadow-lg transition">
                    Save
                </button>
            </div>

            {/* User Input */}
            <textarea
                placeholder="Enter your SQL schema or use case..."
                className="w-96 p-3 border border-gray-700 bg-gray-800 text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={6}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            ></textarea>

            <button 
                onClick={generatePlantUML} 
                className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-semibold rounded shadow-lg transition">
                Generate Diagram
            </button>

            {/* Display Results */}
            {plantUMLCode && (
                <div className="mt-6 w-96 p-4 bg-gray-800 text-gray-300 rounded-xl shadow-lg">
                    <h2 className="text-lg font-semibold text-white">Generated PlantUML Code</h2>
                    <pre className="text-sm p-2 bg-gray-900 rounded">{plantUMLCode}</pre>
                </div>
            )}

            {diagramURL && (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold text-white">Generated ER Diagram</h2>
                    <img src={diagramURL} alt="ER Diagram" className="border rounded-xl shadow-lg mt-2" />
                    <a href={diagramURL} download="er-diagram.svg" className="block mt-2 text-blue-400 hover:underline">
                        Download Diagram
                    </a>
                </div>
            )}
        </div>
    );
}
