
import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function useSpeech() {
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechSynthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize voices and speech synthesis
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get speech synthesis instance
    speechSynthRef.current = window.speechSynthesis;

    // Function to load voices
    const loadVoices = () => {
      if (speechSynthRef.current) {
        const voices = speechSynthRef.current.getVoices();
        setAvailableVoices(voices);
      }
    };

    // Load voices initially
    loadVoices();

    // Set up event listener for voiceschanged
    if (speechSynthRef.current && 'onvoiceschanged' in speechSynthRef.current) {
      speechSynthRef.current.onvoiceschanged = loadVoices;
    }

    // Cleanup
    return () => {
      if (speechSynthRef.current && currentUtteranceRef.current) {
        speechSynthRef.current.cancel();
      }
    };
  }, []);

  // Function to speak text
  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!speechSynthRef.current) return;

    // Cancel any previous speech
    stopSpeaking();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified
    if (options.voice) {
      const selectedVoice = availableVoices.find(v => v.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Set other options
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.volume !== undefined) utterance.volume = options.volume;
    
    // Set event handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    // Store the current utterance reference
    currentUtteranceRef.current = utterance;
    
    // Start speaking
    speechSynthRef.current.speak(utterance);
  }, [availableVoices]);

  // Function to stop speaking
  const stopSpeaking = useCallback(() => {
    if (speechSynthRef.current) {
      speechSynthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    speak,
    stopSpeaking,
    isSpeaking,
    availableVoices
  };
}
