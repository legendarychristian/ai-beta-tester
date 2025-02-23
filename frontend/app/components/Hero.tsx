"use client";
import { ArrowRight, X } from "lucide-react";
import { useState, ChangeEvent, useEffect } from "react";
import { useDemographic } from "../DemographicContext";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  onLoadingComplete: () => void;
}

export default function Hero({ onLoadingComplete }: HeroProps) {
  const { setDemographicData } = useDemographic();
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
    "Turning coffee into compelling pitches...",
    "Assembling buzzwords that actually make sense...",
    "Spicing things up with some wow-factor...",
    "Channeling startup energy...",
    "Aligning synergies and leveraging paradigms...",
    "Refining your pitch... because first impressions matter...",
    "Optimizing for maximum head nods in the room...",
    "Sprinkling in a dash of confidence...",
    "Prepping jaw-dropping insights...",
    "Making your pitch investor-friendly (and wallet-ready)...",
    "Synthesizing brilliance with a touch of magic...",
    "Distilling your vision into pure gold...",
    "Ensuring your pitch is smoother than your coffee...",
    "Brainstorm clouds clearing... sunshine incoming...",
    "Finalizing the secret sauce recipe...",
    "Hunting for those 'aha!' moments...",
    "Recalibrating brilliance sensors...",
    "Generating applause-worthy content...",
    "Adding extra sparkle for dramatic effect...",
    "Running a quick charisma check...",
    "Cueing up the mic drop moment...",
    "Formatting for maximum investor attention...",
    "Dusting off jargon (and keeping it human)...",
    "Wrapping it up with a bow and a smile...",
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
      clearInterval(interval); // Cleanup on unmount
      document.body.classList.remove("no-scroll"); // Ensure scrolling is enabled
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
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setCurrentPhaseIndex(0);

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
        setDemographicData(responseData.demographic_analysis);
      } else {
        console.warn("⚠️ demographic_analysis not found in response");
      }

      // ✅ Trigger scroll or action after loading completes
      onLoadingComplete();

    } catch (error) {
      console.error("❌ Error starting conversation:", error);
    } finally {
      setTimeout(() => setIsSubmitting(false), 500); // Smoother end of loading
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E9E4F4] via-[#E9E4F4] to-[#FDECE6] text-center px-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-center w-full h-1/3 pb-16">
        <h1 className="text-8xl md:text-7xl font-openSans font-thin text-purple-800 mb-8">
          Propel your pitch forward.
        </h1>
        <h1 className="text-2xl font-openSans font-thin text-purple-800 mb-8">
          There are no shortcuts to a good product pitch. But we can help you get there.
        </h1>
      </div>

      {/* Input Box */}
      <div className="relative w-full md:w-1/2 bg-white rounded-2xl px-6 py-6 shadow-lg">
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
          className={`absolute bottom-2 right-4 w-11 h-11 flex justify-center items-center rounded-full ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-[#CDBFEA] hover:bg-[#9277CC]"
          } text-white transition duration-300`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Loading Phases */}
      <div className="min-h-[40px] flex justify-center items-center mt-24">
        <AnimatePresence mode="wait">
          {isSubmitting && (
            <motion.div
              key={loadingPhases[currentPhaseIndex]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-purple-800 font-light font-openSans text-2xl"
            >
              {loadingPhases[currentPhaseIndex]}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}