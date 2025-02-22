"use client";
import { useEffect } from "react";
import Hero from "./components/Hero";
import Conversation from "./components/Conversation";

export default function Home() {
  useEffect(() => {
    document.body.classList.add("no-scroll"); // Default: no scroll
  }, []);
  return (
    <div>
      <Hero />
      <Conversation />
    </div>
  )
}
