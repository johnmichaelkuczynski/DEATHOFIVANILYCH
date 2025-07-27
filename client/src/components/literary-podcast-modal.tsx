import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause, Download, Volume2, Headphones } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AIModel } from "@shared/schema";

interface LiteraryPodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  contextText: string;
  selectedModel: AIModel;
}

export default function LiteraryPodcastModal({
  isOpen,
  onClose,
  selectedText,
  contextText,
  selectedModel
}: LiteraryPodcastModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleClose = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setAudioUrl(null);
    onClose();
  };

  const generateLiteraryPodcast = async () => {
    if (!selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please select some text to create a literary podcast.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest("/api/generate-literary-podcast", {
        method: "POST",
        body: JSON.stringify({
          text: selectedText,
          contextText: contextText,
          model: selectedModel
        })
      });

      const data = await response.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "Literary podcast generated!",
          description: "Your podcast is ready to play."
        });
      } else {
        throw new Error("No audio URL received");
      }
    } catch (error) {
      console.error("Error generating literary podcast:", error);
      toast({
        title: "Generation failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlayback = () => {
    if (!audioUrl) return;

    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.play();
        setIsPlaying(true);
      } else {
        const newAudio = new Audio(audioUrl);
        newAudio.addEventListener('ended', () => setIsPlaying(false));
        newAudio.addEventListener('error', () => {
          toast({
            title: "Playback error",
            description: "Unable to play the audio file.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
        setAudio(newAudio);
        newAudio.play();
        setIsPlaying(true);
      }
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = 'literary-podcast.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Audio download started" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Headphones className="w-5 h-5 text-orange-600" />
            <span>Literary Podcast</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Text Preview */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Analyzing Passage:</h4>
            <div className="bg-orange-50 dark:bg-orange-900/30 rounded-lg p-3 border border-orange-200 dark:border-orange-800 max-h-24 overflow-y-auto">
              <p className="text-sm text-orange-900 dark:text-orange-100">
                "{selectedText.substring(0, 200)}..."
              </p>
            </div>
          </div>

          {/* Generation Button */}
          {!audioUrl && (
            <Button
              onClick={generateLiteraryPodcast}
              disabled={isGenerating}
              className="w-full bg-orange-600 hover:bg-orange-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Literary Podcast...
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4 mr-2" />
                  Generate Literary Podcast
                </>
              )}
            </Button>
          )}

          {/* Audio Player */}
          {audioUrl && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Literary Analysis Podcast</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadAudio}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="bg-muted rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    size="lg"
                    onClick={togglePlayback}
                    className="rounded-full w-16 h-16 bg-orange-600 hover:bg-orange-700"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white ml-1" />
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4" />
                  <span>{isPlaying ? "Playing..." : "Ready to play"}</span>
                </div>
              </div>

              <Button
                onClick={() => {
                  setAudioUrl(null);
                  if (audio) {
                    audio.pause();
                    setIsPlaying(false);
                    setAudio(null);
                  }
                  generateLiteraryPodcast();
                }}
                variant="outline"
                className="w-full"
              >
                Generate New Podcast
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}