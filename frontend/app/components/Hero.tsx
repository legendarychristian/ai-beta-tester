"use client";
import { ArrowRight, X } from "lucide-react";
import { useState, ChangeEvent } from "react";
import AnalysisCharts from "./AnalysisCharts";
import { useDemographic } from "../DemographicContext";  // Import the custom hook
import { useRouter } from "next/navigation";


export default function Hero() {
    const { setDemographicData } = useDemographic();  // Access the setter
    const router = useRouter();
    const [pitch, setPitch] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 🔑 New states to store API data
    const [scores, setScores] = useState<null | Record<string, any>>(null);
    const [demographicAnalysis, setDemographicAnalysis] = useState<null | Record<string, any>>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const validFiles = Array.from(selectedFiles).filter((file) =>
                file.type.startsWith("image/")
            );

            setFiles((prevFiles) => [...prevFiles, ...validFiles]);
            setImagePreviews((prevPreviews) => [
                ...prevPreviews,
                ...validFiles.map((file) => URL.createObjectURL(file)),
            ]);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
        setImagePreviews((prevPreviews) =>
            prevPreviews.filter((_, i) => i !== index)
        );
    };

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("product_info", pitch);
            files.forEach((file, index) => formData.append(`file_${index}`, file));

            const response = await fetch("http://localhost:8000/conversation/start", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`Network error: ${response.status}`);

            const responseData = await response.json();
            console.log("✅ Full API response:", responseData);

            if (responseData.demographic_analysis) {
                setDemographicData(responseData.demographic_analysis);  // ✅ Set data in context
            } else {
                console.warn("⚠️ demographic_analysis not found in response");
            }

        } catch (error) {
            console.error("❌ Error starting conversation:", error);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E9E4F4] via-[#E9E4F4] to-[#FDECE6] text-center px-4">
            {/* Header */}
            <div className="flex flex-col items-center justify-center w-full h-1/3 pb-16">
                <h1 className="text-8xl md:text-7xl font-openSans font-thin text-purple-800 mb-8">
                    Propel your pitch forward.
                </h1>
                <h1 className="text-8xl md:text-2xl font-openSans font-thin text-purple-800 mb-8">
                    There are no shortcuts to a good product pitch. But we can help you get there.
                </h1>
            </div>

            {/* Input Box */}
            <div className="relative w-full md:w-1/2 bg-white rounded-2xl px-6 py-4 shadow-lg">
                {/* File Upload Button */}
                <label
                    htmlFor="file-upload"
                    className="absolute bottom-2 left-4 w-11 h-11 flex justify-center items-center rounded-full border text-[#9277CC] hover:bg-[#9277CC] hover:text-white text-lg cursor-pointer transition duration-300"
                >
                    +
                </label>
                <input
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                />

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                    <div className="flex flex-wrap gap-4 mb-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                                <img
                                    src={preview}
                                    alt={`Uploaded Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => handleRemoveImage(index)}
                                    className="absolute top-1 right-1 w-6 h-6 flex justify-center items-center rounded-full bg-black text-white hover:bg-gray-800 shadow transition"
                                    title="Remove image"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Text Area */}
                <textarea
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Tell us your pitch..."
                    className="w-full h-24 pt-2 text-left bg-transparent font-openSans font-thin text-purple-800 placeholder-purple-800 focus:outline-none resize-none"
                />

                {/* Submit Button */}
                <button
                    className="absolute bottom-2 right-4 w-11 h-11 flex justify-center items-center rounded-full bg-[#CDBFEA] text-white hover:bg-[#9277CC] transition duration-300"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    <ArrowRight size={20} />
                </button>
            </div>

            {/* Render AnalysisCharts component if demographic data is available */}
            {demographicAnalysis && (
                <AnalysisCharts demographData={demographicAnalysis} />
            )}
        </section>
    );
}