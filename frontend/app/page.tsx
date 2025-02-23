"use client";
import { useEffect, useRef } from "react";
import Hero from "./components/Hero";
import Conversation from "./components/Conversation";
export default function Home() {
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.classList.add("no-scroll"); // Default: no scroll
  }, []);

  const scrollToConversation = () => {
    conversationRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div>
      <Hero onLoadingComplete={scrollToConversation} />
      <div ref={conversationRef}>
        <Conversation />
      </div>
    </div>
  );
}
