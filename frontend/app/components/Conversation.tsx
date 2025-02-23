"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useConversation } from "../context/ConversationContext";
import { createAvatarFromConfig, avatarConfigs } from "./avatarConfig";

export default function Conversation() {
  const router = useRouter();
  const [demographicData, setDemographicData] = useState<any>(null);
  const { speechSwitch } = useConversation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<"salesman" | "customer" | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    router.prefetch('/charts');
  }, [router]);

  const handlePlayAudio = async () => {
    try {
      if (!audioUrl) {
        const playResponse = await fetch("http://localhost:8000/conversation/play");
        if (!playResponse.ok) {
          throw new Error("Failed to fetch audio");
        }
        const blob = await playResponse.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        audioRef.current = new Audio(url);
      }

      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
        syncHighlights();
      }
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handlePauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
    setActiveSpeaker(null);
  };

  // Synchronize highlights with speechSwitch
  const syncHighlights = () => {
    if (!speechSwitch.length) return;

    speechSwitch.forEach((time, index) => {
      const timeout = setTimeout(() => {
        setActiveSpeaker(index % 2 === 0 ? "salesman" : "customer");
      }, time);
      timeoutRefs.current.push(timeout);
    });

    // Clear highlight at the end of the conversation
    const finalTimeout = setTimeout(() => setActiveSpeaker(null), speechSwitch[speechSwitch.length - 1]);
    timeoutRefs.current.push(finalTimeout);
  };

  const supportAgentConfig = "whiteMale" as keyof typeof avatarConfigs;
  const customerConfig = "whiteFemale" as keyof typeof avatarConfigs;

  const supportAgentAvatar = createAvatarFromConfig(supportAgentConfig);
  const customerAvatar = createAvatarFromConfig(customerConfig);

  const getSalesPersonLabel = (config: keyof typeof avatarConfigs): string => {
    return config.includes('Female') ? 'Saleswoman' : 'Salesman';
  };

  useEffect(() => {
    router.prefetch('/charts'); // Prefetch "About" page
  }, [router]);

  const handleAnalyticsClick = () => {
    router.push("/charts");
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FDECE6] via-[#FDECE6] to-[#F9D7C8] font-openSans text-center px-4">
      <div className="h-screen flex justify-center">
        <div className="flex flex-col w-full h-full">
          <h1 className="text-8xl md:text-4xl font-openSans font-thin text-purple-800 mb-8 py-16">
            Chatting with your <span className="font-semibold">customers</span>, made delightful.
          </h1>
          <div className="flex flex-row w-full h-3/4 gap-48 px-24">
            <div className="flex flex-col w-1/2 h-full rounded-lg">
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#FCE7E0] to-[#F4D4C8] rounded-lg p-8">
                <img 
                  src={supportAgentAvatar.toDataUri()}
                  alt="Sales Agent Avatar"
                  className="w-48 h-48 mb-4"
                />
                <p className="text-lg font-semibold text-purple-800">{getSalesPersonLabel(supportAgentConfig)}</p>
              </div>
            </div>

            {/* Customer Box */}
            <div
              className={`flex flex-col w-1/2 h-full rounded-lg transition border-4 ${
                activeSpeaker === "customer" ? "border-green-500" : "border-transparent"
              }`}
            >
              <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-[#FCE7E0] to-[#F4D4C8] rounded-lg p-8">
                <img 
                  src={customerAvatar.toDataUri()}
                  alt="Customer Avatar"
                  className="w-48 h-48 mb-4"
                />
                <p className="text-lg font-semibold text-purple-800">Customer</p>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-center w-full h-1/4 gap-12 text-black">
            <button className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black">
              Download
            </button>
            <button className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
            onClick={handlePlayAudio}
            >
              Play
            </button>
            <button className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
            onClick={handlePauseAudio}
            >
              Pause
            </button>
            <button 
              className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
              onClick={handleAnalyticsClick}>
              Analytics
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}