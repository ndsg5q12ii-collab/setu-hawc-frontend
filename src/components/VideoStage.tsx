import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Share2,
  MessageSquare,
  Send,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X,
  Lock,
  Wifi,
} from './icons';
import { Technician, ChatMessage } from '../types';
import { Avatar, Badge, Button, cx } from './ui';

export interface VideoStageProps {
  role: 'customer' | 'technician';
  technician: Technician;
  customerName: string;
  bookingId: string;
  onEndCall: () => void;
  deviceCategory?: string;
  issueDescription?: string;
}

export const VideoStage: React.FC<VideoStageProps> = ({
  role,
  technician,
  customerName,
  bookingId,
  onEndCall,
  deviceCategory = 'laptop',
  issueDescription,
}) => {
  // Call Controls State
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');

  // Network & Edge Case Simulation State (per Flowchart 2)
  const [connectionState, setConnectionState] = useState<'connected' | 'reconnecting' | 'failed'>('connected');

  // Live Timer
  const [seconds, setSeconds] = useState(145);
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'system',
      senderName: 'System',
      text: 'Session started. End-to-end encrypted technical diagnostic channel active.',
      timestamp: '10:15 AM',
    },
    {
      id: 'm-2',
      sender: role === 'customer' ? 'technician' : 'customer',
      senderName: role === 'customer' ? technician.name : customerName,
      text: role === 'customer'
        ? "Hi Niladri! I see your diagnostic request for the MacBook crash. Can you tilt your camera slightly toward the keyboard and screen?"
        : "Hello! My screen just went completely black after showing a pink screen error.",
      timestamp: '10:16 AM',
    },
    {
      id: 'm-3',
      sender: role === 'customer' ? 'technician' : 'customer',
      senderName: role === 'customer' ? technician.name : customerName,
      text: role === 'customer'
        ? "Got it. First, let's try a safe SMC reset by holding Shift + Control + Option + Power for 10 seconds."
        : "Okay, I'm pressing the buttons now.",
      timestamp: '10:17 AM',
    },
  ]);
  const [newInputText, setNewInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: role === 'customer' ? 'customer' : 'technician',
      senderName: role === 'customer' ? customerName : technician.name,
      text: newInputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setNewInputText('');
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Simulate Glitch/Reconnection
  const triggerConnectionGlitch = () => {
    setConnectionState('reconnecting');
    setTimeout(() => {
      setConnectionState('connected');
    }, 3500);
  };

  return (
    <div className="relative w-full h-full bg-ink text-white flex flex-col overflow-hidden select-none font-sans">
      {/* Top Header Floating Controls */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={role === 'customer' ? technician.avatar : undefined}
            name={role === 'customer' ? technician.name : customerName}
            size="sm"
            verified={role === 'customer' ? technician.verified : false}
          />
          <div>
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>{role === 'customer' ? technician.name : customerName}</span>
              <Badge variant="verified" size="sm" className="bg-primary/40 text-blue-200 border-none">
                {role === 'customer' ? 'Verified Tech' : 'Customer'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-0.5">
              <span className="flex items-center gap-1 font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {formatTime(seconds)}
              </span>
              <span>•</span>
              <span className="font-mono text-gray-400">{bookingId}</span>
            </div>
          </div>
        </div>

        {/* Connection status pill with interactive reconnect test */}
        <div className="flex items-center gap-2">
          <button
            onClick={triggerConnectionGlitch}
            title="Click to simulate network drop/reconnect edge case"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ink-2/90 border border-gray-700 hover:border-gray-500 text-[11px] text-gray-200 backdrop-blur-md transition-all active:scale-95"
          >
            <Wifi className={cx('w-3 h-3', connectionState === 'connected' ? 'text-emerald-400' : 'text-amber-400 animate-spin')} />
            <span>{connectionState === 'connected' ? 'HD 1080p' : 'Reconnecting...'}</span>
          </button>
        </div>
      </div>

      {/* Main Video Surface */}
      <div className="relative flex-1 bg-ink-2 flex items-center justify-center overflow-hidden">
        {/* Network Lost Overlay if simulated */}
        {connectionState === 'reconnecting' && (
          <div className="absolute inset-0 z-40 bg-ink/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-up">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mb-3" />
            <h4 className="text-base font-bold">Connection Interrupted</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-xs">
              Attempting auto-reconnection with peer... Audio buffer maintained.
            </p>
          </div>
        )}

        {/* Primary Remote Feed Representation */}
        <div className="w-full h-full relative flex items-center justify-center bg-radial from-ink-3 to-ink">
          {/* Subtle animated audio waves in the background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
            <div className="w-72 h-72 rounded-full border border-primary/40 animate-radar-1" />
            <div className="w-96 h-96 rounded-full border border-primary/30 animate-radar-2" />
          </div>

          <div className="flex flex-col items-center z-10 text-center px-4">
            <div className="relative mb-4">
              <Avatar
                src={role === 'customer' ? technician.avatar : undefined}
                name={role === 'customer' ? technician.name : customerName}
                size="xl"
                verified
              />
              {!isMicMuted && (
                <div className="absolute -bottom-2 inset-x-0 flex items-center justify-center gap-1 bg-black/60 backdrop-blur-md py-0.5 px-2 rounded-full border border-emerald-500/40">
                  <div className="w-1 bg-emerald-400 rounded-full wave-bar-1" />
                  <div className="w-1 bg-emerald-400 rounded-full wave-bar-2" />
                  <div className="w-1 bg-emerald-400 rounded-full wave-bar-3" />
                  <div className="w-1 bg-emerald-400 rounded-full wave-bar-4" />
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg text-white">
              {role === 'customer' ? technician.name : customerName}
            </h3>
            <p className="text-xs text-gray-400 max-w-xs mt-1">
              {role === 'customer'
                ? 'Guiding remote troubleshooting for your ' + deviceCategory
                : 'Customer feed: ' + (issueDescription || 'MacBook hardware diagnostics')}
            </p>

            {/* Diagnostic hint pill */}
            <div className="mt-4 px-3.5 py-1.5 rounded-full bg-ink-3/80 border border-gray-700/60 text-xs text-gray-300 flex items-center gap-2 shadow-soft">
              <Lock className="w-3.5 h-3.5 text-primary-soft" />
              <span>Realtime Diagnostic Channel</span>
            </div>
          </div>

          {/* Self Picture-in-Picture (PiP) Window */}
          <div className="absolute bottom-20 right-4 z-20 w-28 h-40 bg-ink-3 rounded-lg border-2 border-gray-700/80 shadow-floating overflow-hidden flex flex-col justify-between p-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-gray-400">You</span>
              <button
                onClick={() => setCameraFacing((p) => (p === 'front' ? 'back' : 'front'))}
                className="text-gray-400 hover:text-white p-0.5 transition-colors"
                title="Flip Camera"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center">
              {isVideoOff ? (
                <VideoOff className="w-6 h-6 text-gray-500" />
              ) : (
                <div className="text-[11px] text-gray-300 font-medium text-center">
                  Cam {cameraFacing === 'front' ? 'Self' : 'Rear'}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>{isMicMuted ? <MicOff className="w-3 h-3 text-red-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}</span>
              <span className="text-[9px] uppercase font-mono">30fps</span>
            </div>
          </div>
        </div>

        {/* Live Chat Drawer */}
        {isChatOpen && (
          <div className="absolute inset-y-0 right-0 z-40 w-full sm:w-80 bg-ink-2/95 border-l border-gray-800 backdrop-blur-lg flex flex-col animate-fade-up">
            <div className="flex items-center justify-between p-3.5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary-soft" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-200">Session Chat</span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages list */}
            <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cx(
                    'p-2.5 rounded-md max-w-[85%]',
                    msg.sender === 'system'
                      ? 'bg-ink-3 text-gray-400 text-center mx-auto text-[11px] max-w-full'
                      : (msg.sender === 'customer' && role === 'customer') || (msg.sender === 'technician' && role === 'technician')
                      ? 'bg-primary text-white self-end ml-auto'
                      : 'bg-ink-3 text-gray-200 self-start'
                  )}
                >
                  {msg.sender !== 'system' && (
                    <div className="text-[10px] opacity-75 font-semibold mb-0.5">{msg.senderName}</div>
                  )}
                  <p>{msg.text}</p>
                  <div className="text-[9px] opacity-60 text-right mt-1 font-mono">{msg.timestamp}</div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800 flex gap-2">
              <input
                type="text"
                value={newInputText}
                onChange={(e) => setNewInputText(e.target.value)}
                placeholder="Type instructions or link..."
                className="flex-1 bg-ink-3 border border-gray-700 rounded-md px-3 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="p-2 bg-primary text-white rounded-md hover:bg-primary-hover active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Bottom Floating Media Toolbar */}
      <div className="relative z-30 p-4 bg-ink/90 border-t border-gray-800/80 backdrop-blur-md flex items-center justify-around gap-2 max-w-lg mx-auto w-full">
        {/* Mic Toggle */}
        <button
          onClick={() => setIsMicMuted(!isMicMuted)}
          className={cx(
            'flex flex-col items-center gap-1 text-[11px] font-medium transition-all p-2 rounded-lg active:scale-95',
            isMicMuted ? 'text-red-400' : 'text-gray-300 hover:text-white'
          )}
        >
          <div className={cx('w-10 h-10 rounded-full flex items-center justify-center', isMicMuted ? 'bg-red-500/20 border border-red-500/40' : 'bg-ink-3')}>
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </div>
          <span>{isMicMuted ? 'Unmute' : 'Mute'}</span>
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoOff(!isVideoOff)}
          className={cx(
            'flex flex-col items-center gap-1 text-[11px] font-medium transition-all p-2 rounded-lg active:scale-95',
            isVideoOff ? 'text-red-400' : 'text-gray-300 hover:text-white'
          )}
        >
          <div className={cx('w-10 h-10 rounded-full flex items-center justify-center', isVideoOff ? 'bg-red-500/20 border border-red-500/40' : 'bg-ink-3')}>
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>
          <span>{isVideoOff ? 'Start Cam' : 'Stop Cam'}</span>
        </button>

        {/* Screen Share */}
        <button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          className={cx(
            'flex flex-col items-center gap-1 text-[11px] font-medium transition-all p-2 rounded-lg active:scale-95',
            isScreenSharing ? 'text-primary' : 'text-gray-300 hover:text-white'
          )}
        >
          <div className={cx('w-10 h-10 rounded-full flex items-center justify-center', isScreenSharing ? 'bg-primary-soft text-primary' : 'bg-ink-3')}>
            <Share2 className="w-5 h-5" />
          </div>
          <span>Share</span>
        </button>

        {/* Chat Drawer Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={cx(
            'flex flex-col items-center gap-1 text-[11px] font-medium transition-all p-2 rounded-lg active:scale-95 relative',
            isChatOpen ? 'text-primary' : 'text-gray-300 hover:text-white'
          )}
        >
          <div className={cx('w-10 h-10 rounded-full flex items-center justify-center', isChatOpen ? 'bg-primary-soft text-primary' : 'bg-ink-3')}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <span>Chat</span>
        </button>

        {/* End Call Button */}
        <button
          onClick={onEndCall}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-300 transition-all p-2 rounded-lg active:scale-95"
        >
          <div className="w-10 h-10 rounded-full bg-error text-white flex items-center justify-center shadow-raised hover:bg-red-700">
            <PhoneOff className="w-5 h-5" />
          </div>
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};
