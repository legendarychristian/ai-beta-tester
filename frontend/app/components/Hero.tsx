"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useDemographic } from "../context/DemographicContext";
import { useConversation } from "../context/ConversationContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";

interface HeroProps {
    onLoadingComplete: () => void;
}

export default function Hero({ onLoadingComplete }: HeroProps) {
    const { setDemographicData } = useDemographic();
    const { setConversationHistory, setEvaluationResults, setScores, setSpeechSwitch, setBestResult } = useConversation();

    const router = useRouter();
    const [pitch, setPitch] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);

    const loadingPhases = [
        "Brewing the perfect pitch...",
        "Polishing your elevator speech...",
        "Crunching numbers and wowing investors...",
        "Almost there... adding a touch of brilliance...",
        "Turning ideas into pitch-perfect words...",
        "Sharpening your story to a fine point...",
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSubmitting) {
            document.body.classList.add("no-scroll");

            interval = setInterval(() => {
                setCurrentPhaseIndex((prevIndex) => (prevIndex + 1) % loadingPhases.length);
            }, 2500);
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            clearInterval(interval);
            document.body.classList.remove("no-scroll");
        };
    }, [isSubmitting]);

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
        setIsSubmitting(true);
        setCurrentPhaseIndex(0);

        try {
            const formData = new FormData();
            formData.append("product_info", pitch);
            files.forEach((file, index) => formData.append(`file_${index}`, file));

            const response = await fetch("https://pitchpropel.com/conversation/start", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error(`Network error: ${response.status}`);

            const responseData = await response.json();
            console.log("✅ Full API response:", responseData);

            if (responseData.convo_results) {
                setConversationHistory(responseData.convo_results);
            }
            if (responseData.eval_results) {
                setEvaluationResults(responseData.eval_results);
            }
            if (responseData.scores) {
                setScores(responseData.scores);
            }
            if (responseData.demographic_analysis) {
                setDemographicData(responseData.demographic_analysis);
            }
            onLoadingComplete();

        } catch (error) {
            console.error("❌ Error starting conversation:", error);
        } finally {
            setTimeout(() => setIsSubmitting(false), 500);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E9E4F4] to-[#FDECE6] text-center px-4">
            {/* Header */}
            <div className="flex flex-col items-center justify-center w-full h-auto pb-8">
                <h1 className="text-5xl md:text-7xl font-openSans font-thin text-purple-800 mb-4">
                    Propel your pitch forward.
                </h1>
                <p className="text-lg md:text-2xl font-openSans font-thin text-purple-800 px-6 mt-12 mb-24"> {/* Increased bottom margin */}
                    There are no shortcuts to a good product pitch. But we can help you get there.
                </p>
            </div>

            {/* Input Box */}
            <div className="relative w-full md:w-2/3 lg:w-1/2 bg-white rounded-xl p-5 shadow-lg">
                {/* File Upload Button */}
                <label
                    htmlFor="file-upload"
                    className="absolute bottom-2 left-4 w-12 h-12 flex justify-center items-center rounded-full border text-[#9277CC] hover:bg-[#9277CC] hover:text-white text-lg cursor-pointer transition duration-300"
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
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {imagePreviews.map((preview, index) => (
                            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
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
                    placeholder="Tell us your product and we'll tell you your market..."
                    className="w-full h-24 pt-2 px-2 text-left bg-transparent font-openSans font-thin text-purple-800 placeholder-purple-800 focus:outline-none resize-none"
                />

                {/* Submit Button */}
                <button
                    className={`absolute bottom-2 right-4 w-12 h-12 flex justify-center items-center rounded-full ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#CDBFEA] hover:bg-[#9277CC]"
                        } text-white transition duration-300`}
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    <ArrowRight size={22} />
                </button>
            </div>

            {/* Loading Phases */}
            <div className="min-h-[40px] flex justify-center items-center mt-16">
                <AnimatePresence mode="wait">
                    {isSubmitting && (
                        <motion.div
                            key={loadingPhases[currentPhaseIndex]}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-purple-800 font-light font-openSans text-lg"
                        >
                            {loadingPhases[currentPhaseIndex]}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
