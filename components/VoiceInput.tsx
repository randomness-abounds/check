
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Keyboard } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
  value: string;
  onChange: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, placeholder, value, onChange }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const shouldListenRef = useRef(false);
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => {
    onTranscriptRef.current = onTranscript;
  }, [onTranscript]);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        setIsSupported(false);
        return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let newTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            newTranscript += event.results[i][0].transcript + ' ';
          }
        }
        if (newTranscript.trim()) {
          onTranscriptRef.current(newTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.warn("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
           setError("Mic blocked");
           setIsListening(false);
           shouldListenRef.current = false;
        } else if (event.error === 'no-speech') {
            // Ignore no-speech, keep listening if possible
        } else {
           // Fallback for other errors
           setIsListening(false);
           shouldListenRef.current = false;
        }
      };

      recognitionRef.current.onend = () => {
        if (shouldListenRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            setIsListening(false);
            shouldListenRef.current = false;
          }
        } else {
          setIsListening(false);
        }
      };
    } catch (e) {
        console.error("Speech Init Failed", e);
        setIsSupported(false);
    }
    
    return () => {
        shouldListenRef.current = false;
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch(e) {}
        }
    };
  }, []);

  const toggleListen = () => {
    if (!isSupported) return;

    if (isListening) {
      shouldListenRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setError(null);
      shouldListenRef.current = true;
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Failed to start mic", e);
        setError("Could not start");
        shouldListenRef.current = false;
      }
    }
  };

  return (
    <div className="w-full relative group">
      <textarea
        className="w-full bg-slate-800/80 border border-slate-700/50 rounded-xl p-5 pr-14 text-slate-100 placeholder-slate-500 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-slate-800 resize-none h-32 transition-all"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        {error && (
            <span className="text-xs text-red-400 bg-red-900/10 px-2 py-1 rounded-md animate-in fade-in flex items-center gap-1 border border-red-900/20">
                <AlertCircle size={12}/> {error}
            </span>
        )}
        
        {isSupported ? (
            <button
            onClick={toggleListen}
            type="button"
            className={`p-3 rounded-xl transition-all duration-300 ${
                isListening 
                ? 'bg-red-500/20 text-red-500 ring-2 ring-red-500/50 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
            }`}
            title={isListening ? "Stop Listening" : "Start Voice Input"}
            >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
        ) : (
             <div className="p-2 text-slate-600" title="Voice not available">
                 <Keyboard size={20} />
             </div>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
