
import React from 'react';
import Header from '@/components/Header';
import TextToSpeechComponent from '@/components/TextToSpeech';

const TextToSpeech: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto mt-8 text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Text to Speech
          </h1>
          <p className="text-gray-600">
            Convert drug information to spoken audio using the Web Speech API
          </p>
        </div>
        <TextToSpeechComponent />
      </div>
    </div>
  );
};

export default TextToSpeech;
