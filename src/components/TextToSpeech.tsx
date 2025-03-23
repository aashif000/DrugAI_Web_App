
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Volume2, Pause, Play, Save, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useSpeech } from '@/hooks/use-speech';

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [voice, setVoice] = useState<string>('default');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [savedMessages, setSavedMessages] = useState<Array<{ text: string, id: string }>>([]);
  
  const { speak, isSpeaking, stopSpeaking, availableVoices } = useSpeech();

  const handleSpeak = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to speak');
      return;
    }
    
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text, {
        voice: voice === 'default' ? undefined : voice,
        rate,
        pitch,
        volume
      });
    }
  };

  const saveMessage = () => {
    if (!text.trim()) {
      toast.error('Please enter some text to save');
      return;
    }
    
    const newMessage = {
      text,
      id: Date.now().toString()
    };
    
    setSavedMessages(prev => [...prev, newMessage]);
    toast.success('Message saved');
  };

  const deleteMessage = (id: string) => {
    setSavedMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const speakSavedMessage = (savedText: string) => {
    speak(savedText, {
      voice: voice === 'default' ? undefined : voice,
      rate,
      pitch,
      volume
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-6 overflow-hidden border border-slate-200">
        <CardContent className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Enter text to speak
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type something to hear it spoken..."
              className="min-h-[120px]"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Voice
              </label>
              <Select value={voice} onValueChange={setVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">System Default</SelectItem>
                  {availableVoices.map((v) => (
                    <SelectItem key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Volume: {volume.toFixed(1)}
              </label>
              <Slider
                value={[volume]}
                min={0}
                max={1}
                step={0.1}
                onValueChange={(vals) => setVolume(vals[0])}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rate: {rate.toFixed(1)}x
              </label>
              <Slider
                value={[rate]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(vals) => setRate(vals[0])}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pitch: {pitch.toFixed(1)}
              </label>
              <Slider
                value={[pitch]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(vals) => setPitch(vals[0])}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={handleSpeak}
              className="gap-2"
            >
              {isSpeaking ? (
                <>
                  <Pause className="h-4 w-4" />
                  Stop Speaking
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Speak Text
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={saveMessage}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Messages */}
      {savedMessages.length > 0 && (
        <Card className="overflow-hidden border border-slate-200">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="font-medium">Saved Messages</h3>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3">
              {savedMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className="p-3 bg-white border border-slate-200 rounded-lg flex items-start justify-between gap-2 hover:border-blue-200 transition-all"
                >
                  <p className="text-sm flex-1 text-slate-700">{msg.text}</p>
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => speakSavedMessage(msg.text)}
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => deleteMessage(msg.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextToSpeech;
