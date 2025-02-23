"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useConversation } from "../context/ConversationContext";
import { createAvatarFromConfig, avatarConfigs } from "./avatarConfig";
import AnalysisCharts from "./AnalysisCharts";
import { useDemographic } from "../DemographicContext";

export default function Conversation() {
  const router = useRouter();
  const { demographicData } = useDemographic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<"salesman" | "customer" | null>(null);
  const { speechSwitch, bestResult } = useConversation();


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
        // Set initial speaker immediately
        setActiveSpeaker("salesman");
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

  const syncHighlights = () => {
    if (!audioRef.current || !speechSwitch || speechSwitch.length === 0) return;

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    speechSwitch.forEach((timestamp, index) => {
      const nextTimestamp = speechSwitch[index + 1] || audioRef.current!.duration * 1000;

      const timeout = setTimeout(() => {
        setActiveSpeaker(index % 2 === 0 ? "salesman" : "customer");
      }, timestamp);

      timeoutRefs.current.push(timeout);

      const clearTimeoutRef = setTimeout(() => {
        setActiveSpeaker(null);
      }, nextTimestamp);

      timeoutRefs.current.push(clearTimeoutRef);
    });
  };

  const raceGenderMapping: Record<string, Record<string, keyof typeof avatarConfigs>> = {
    "White": {
      "Male": "whiteMale",
      "Female": "whiteFemale"
    },
    "Black or African American": {
      "Male": "blackMale",
      "Female": "blackFemale"
    },
    "Asian": {
      "Male": "asianMale",
      "Female": "asianFemale"
    },
    "American Indian or Alaska Native": {
      "Male": "alaskanNativeMale",
      "Female": "alaskanNativeFemale"
    },
    "Native Hawaiian or Pacific Islander": {
      "Male": "pacificIslanderMale",
      "Female": "pacificIslanderFemale"
    },
    "Multiracial": {
      "Male": "multiracialMale",
      "Female": "multiracialFemale"
    },
    "Other": {
      "Male": "multiracialMale", // Default to multiracial if unspecified
      "Female": "multiracialFemale"
    }
  };

  // Function to get avatar config from persona
  const getAvatarConfig = (race: string, sex: string): keyof typeof avatarConfigs => {
    return raceGenderMapping[race]?.[sex] || "whiteMale"; // Default to "whiteMale" if undefined
  };

  const buyerRace = bestResult?.persona?.race || "White"; // Default to "White" if race is missing
  const buyerSex = bestResult?.persona?.sex || "Male"; // Default to "Male" if sex is missing
  const buyerAvatarConfig = getAvatarConfig(buyerRace, buyerSex);

  const supportAgentRace = buyerRace === "White" ? "Black or African American" : "White"; // Alternate race
  const supportAgentAvatarConfig = getAvatarConfig(supportAgentRace, "Male"); // Always male

  const customerConfig = buyerAvatarConfig as keyof typeof avatarConfigs;
  const customerAvatar = createAvatarFromConfig(customerConfig);

  const supportAgentConfig = supportAgentAvatarConfig as keyof typeof avatarConfigs;
  const supportAgentAvatar = createAvatarFromConfig(supportAgentConfig);


  const getSalesPersonLabel = (config: keyof typeof avatarConfigs): string => {
    return config.includes('Female') ? 'Saleswoman' : 'Salesman';
  };

  const handleAnalyticsClick = () => {
    router.push("/charts");
  };

  return (
    <div>
      <section className="min-h-screen bg-gradient-to-b from-[#FDECE6] via-[#FDECE6] to-[#F9D7C8] font-openSans text-center px-4">
        <div className="h-screen flex justify-center">
          <div className="flex flex-col w-full h-full">
            <h1 className="text-8xl md:text-4xl font-openSans font-thin text-purple-800 mb-8 py-16">
              Chatting with your <span className="font-semibold">customers</span>, made delightful.
            </h1>

            <div className="flex flex-row w-full h-3/4 gap-48 px-24">
              {/* Salesperson Box */}
              <div
                className={`flex flex-col w-1/2 h-full rounded-lg transition border-4 ${activeSpeaker === "salesman" ? "border-green-500" : "border-transparent"
                  }`}
              >
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
                className={`flex flex-col w-1/2 h-full rounded-lg transition border-4 ${activeSpeaker === "customer" ? "border-green-500" : "border-transparent"
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
              <button
                className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
                onClick={handlePlayAudio}
              >
                Play
              </button>
              <button
                className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
                onClick={handlePauseAudio}
              >
                Pause
              </button>
              <button
                className="flex items-center justify-center px-8 py-2 rounded-full bg-[#F4D4C8] border border-[#DDC4BC] shadow-md transition duration-300 ease-in-out hover:bg-[#E9C7B9] text-black"
                onClick={handleAnalyticsClick}
              >
                Analytics
              </button>
            </div>
          </div>
        </div>
      </section>
      <div className=" bg-gradient-to-b from-[#F9D7C8] via-[#C8E9F1] to-[#E8F8FF] text-black">
        <section className="min-h-screen font-openSans text-center px-4">
          <AnalysisCharts demographData={demographicData} />
        </section>
      </div>
    </div>
  );
}