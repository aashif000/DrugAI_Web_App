import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Database, MessageSquare, Image, Volume2, ArrowUpRight } from 'lucide-react';
import Header from '@/components/Header';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/50 to-white">
      <Header />
      
      <div className="container mx-auto pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto mt-16 text-center animate-fade-in">
          <div className="mb-6 inline-block p-2 bg-blue-50 rounded-full">
            <div className="bg-blue-500/10 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              Advanced Drug Information Platform
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Drug AI Assistant
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            An intelligent platform combining comprehensive drug information with
            AI assistance to provide the insights you need.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="gap-2 px-8 py-7 text-base rounded-full shadow-md hover:shadow-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Link to="/database">
                Explore Drug Database
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 px-8 py-7 text-base rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Link to="/chat">
                Start AI Conversation
                <MessageSquare className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 stagger-animation">
          <FeatureCard 
            icon={<Database className="h-10 w-10 text-blue-500" />}
            title="Drug Database"
            description="Access comprehensive information on thousands of medications from our CDN-powered database."
            linkText="Search Database"
            linkUrl="/search"
          />
          
          <FeatureCard 
            icon={<MessageSquare className="h-10 w-10 text-blue-500" />}
            title="AI Chat"
            description="Interact with our AI assistant powered by Gemini API to get detailed drug information."
            linkText="Chat Now"
            linkUrl="/chat"
            highlighted={true}
          />
          
          <FeatureCard 
            icon={<Image className="h-10 w-10 text-blue-500" />}
            title="Image Upload"
            description="Upload images of medications for identification and information retrieval."
            linkText="Upload Images"
            linkUrl="/image-upload"
          />
          
          <FeatureCard 
            icon={<Volume2 className="h-10 w-10 text-blue-500" />}
            title="Text to Speech"
            description="Convert drug information to spoken audio using the Web Speech API."
            linkText="Try Text to Speech"
            linkUrl="/tts"
          />
        </div>
        
        <div className="mt-24 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Search"
              description="Explore our extensive database of medications and drug information."
            />
            <StepCard
              number="02"
              title="Interact"
              description="Ask questions to our AI assistant about medications and get detailed responses."
            />
            <StepCard
              number="03"
              title="Learn"
              description="Get comprehensive information about dosage, side effects, and interactions."
            />
          </div>
        </div>
      </div>
    </div>
  );
};


interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  highlighted?: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, linkText, linkUrl, highlighted = false }) => {
  return (
    <Card className={`group relative border border-slate-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 overflow-hidden h-full min-h-[300px] ${highlighted ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className={`rounded-full ${highlighted ? 'bg-blue-100' : 'bg-blue-50'} p-4 w-fit mb-4 transition-colors`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 mb-4 flex-grow">{description}</p>
        <Button asChild variant="ghost" className="gap-1 justify-start pl-0 hover:pl-1 transition-all duration-200 group-hover:bg-blue-50">
          <Link to={linkUrl} className="hover:no-underline">
            {linkText}
            <ArrowUpRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

// Remove the CSS keyframes and animation styles from here
interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="bg-blue-50 text-blue-700 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg mb-4 mx-auto">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default Index;
