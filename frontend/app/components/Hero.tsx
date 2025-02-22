"use client";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#2A1134] via-[#2A1134] to-[#722D7D] text-center px-4">
            <div className="flex items-center justify-center w-full h-1/3 pb-56">
                <h1 className="text-8xl md:text-7xl font-bold text-[#D3DBFD] mb-8">
                    Product pitches for investors,<br /> in minutes.
                </h1>
            </div>
            <div className="relative w-1/2 bg-purple-200 rounded-2xl px-4 py-4">
                {/* Plus Button at Bottom Left */}
                <button className="absolute bottom-2 left-2 w-10 h-10 flex justify-center items-center rounded-full border border-purple-600 text-purple-800 hover:bg-purple-300 text-lg">
                    +
                </button>

                {/* Input Field with Text Starting at Top Left */}
                <textarea
                    placeholder="Enter pitch..."
                    className="w-full h-24 pt-2 text-left align-top bg-transparent text-purple-800 placeholder-purple-500 focus:outline-none resize-none"
                />

                {/* Arrow Button at Bottom Right */}
                <button className="absolute bottom-2 right-2 w-10 h-10 flex justify-center items-center rounded-full bg-purple-800 text-purple-100 hover:bg-purple-700">
                    <ArrowRight size={20} />
                </button>
            </div>
        </section>
    );
}
