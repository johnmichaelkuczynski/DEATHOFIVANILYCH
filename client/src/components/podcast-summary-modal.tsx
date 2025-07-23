import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Download, Volume2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import type { AIModel } from "@shared/schema";

interface PodcastSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  selectedModel: AIModel;
}

export default function PodcastSummaryModal({
  isOpen,
  onClose,
  selectedText,
  selectedModel
}: PodcastSummaryModalProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [podcastScript, setPodcastScript] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  
  const audioRef = useState<HTMLAudioElement | null>(null)[0];

  const canAccessFullFeature = () => {
    if (!isAuthenticated || !user) return false;
    return user.credits > 0;
  };

  const getPreviewScript = (script: string) => {
    if (canAccessFullFeature()) return script;
    const words = script.split(' ');
    return words.slice(0, 100).join(' ') + (words.length > 100 ? '... [PREVIEW - Register and purchase credits to access full podcast script]' : '');
  };

  const handleGeneratePodcast = async () => {
    if (!selectedText.trim()) {
      toast({
        title: "No Text Selected",
        description: "Please select some text to generate a podcast summary.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate podcast script
      const scriptResponse = await apiRequest('/api/generate-podcast-script', {
        method: 'POST',
        body: JSON.stringify({
          text: selectedText,
          model: selectedModel
        })
      });

      if (!scriptResponse.ok) {
        throw new Error('Failed to generate podcast script');
      }

      const scriptData = await scriptResponse.json();
      setPodcastScript(scriptData.script);

      // Generate audio if user has access
      if (canAccessFullFeature()) {
        const audioResponse = await apiRequest('/api/generate-podcast-audio', {
          method: 'POST',
          body: JSON.stringify({
            script: scriptData.script
          })
        });

        if (audioResponse.ok) {
          const audioBlob = await audioResponse.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
        }
      }

    } catch (error) {
      console.error('Error generating podcast:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate podcast summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    if (!audioUrl) return;
    
    if (!audioRef) {
      const audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentTime(0);
      });
      audio.volume = volume / 100;
    }

    if (isPaused) {
      audioRef?.play();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      audioRef?.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    audioRef?.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (audioRef) {
      audioRef.pause();
      audioRef.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'podcast-summary.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef) {
      audioRef.volume = newVolume / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>🎧 Podcast Summary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Text Preview */}
          <div className="space-y-2">
            <h3 className="font-medium">Selected Text:</h3>
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
              "{selectedText.substring(0, 200)}..."
            </div>
          </div>

          {/* Generate Button */}
          {!podcastScript && (
            <div className="text-center">
              <Button
                onClick={handleGeneratePodcast}
                disabled={isGenerating}
                className="px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Podcast...
                  </>
                ) : (
                  <>
                    🎧 Generate Podcast Summary
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Audio Player */}
          {audioUrl && canAccessFullFeature() && (
            <div className="bg-card border rounded-lg p-4 space-y-4">
              <h3 className="font-medium">Audio Player</h3>
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  onClick={isPlaying ? handlePause : handlePlay}
                  size="sm"
                  className="px-6"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  <span className="ml-2">{isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStop}
                  disabled={!isPlaying && !isPaused}
                >
                  <Square className="h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span className="ml-2">Download</span>
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume]}
                  onValueChange={handleVolumeChange}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground w-12">{volume}%</span>
              </div>
            </div>
          )}

          {/* Limited Audio for Non-Premium Users */}
          {!canAccessFullFeature() && podcastScript && (
            <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                Audio Preview (30 seconds)
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                Register and purchase credits to access full audio and download functionality.
              </p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">
                  <Play className="h-4 w-4 mr-2" />
                  Play Preview
                </Button>
                <Button size="sm" onClick={() => window.open('/register', '_blank')}>
                  Get Full Access
                </Button>
              </div>
            </div>
          )}

          {/* Podcast Script */}
          {podcastScript && (
            <div className="space-y-2">
              <h3 className="font-medium">Podcast Script:</h3>
              <ScrollArea className="h-64 w-full rounded-md border p-4">
                <div className="text-sm whitespace-pre-wrap">
                  {getPreviewScript(podcastScript)}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {podcastScript && (
              <Button
                onClick={handleGeneratePodcast}
                disabled={isGenerating}
                variant="outline"
              >
                🎧 Generate New Podcast
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}