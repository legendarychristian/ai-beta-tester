"use client";
import { ArrowRight } from "lucide-react";
import { useState } from 'react';

export default function Hero() {
    const [pitch, setPitch] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!pitch.trim()) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('product_info', pitch);
            if (file) formData.append('file', file);

            const response = await fetch('http://localhost:8000/conversation/start', {
                method: 'POST',
                body: formData, // FormData includes both text and file data
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Conversation started:', data);

            // Clear input and file after submission
            setPitch('');
            setFile(null);
        } catch (error) {
            console.error('Error starting conversation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#E9E4F4] via-[#FDECE6] to-[#FDECE6] text-center px-4">
            {/* Header */}
            <div className="flex flex-col items-center justify-center w-full h-1/3 pb-56">
                <h1 className="text-8xl md:text-7xl font-openSans font-thin text-purple-800 mb-8">
                    Propel your pitch forward.
                </h1>
                <h1 className="text-8xl md:text-2xl font-openSans font-thin text-purple-800 mb-8">
                    There are no shortcuts to a good product pitch. But we can help you get there.
                </h1>
            </div>

            {/* Input Box with Buttons */}
            <div className="relative w-1/2 bg-white rounded-2xl px-6 py-4 shadow-lg">
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
                    className="hidden" 
                    onChange={handleFileChange} 
                />

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

            {/* Display selected file */}
            {file && (
                <p className="mt-4 text-purple-800">
                    Selected file: {file.name}
                </p>
            )}
        </section>
    );
}
