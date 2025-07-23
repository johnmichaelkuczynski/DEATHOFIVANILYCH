import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Play, Pause, Download, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AIModel } from "@shared/schema";

interface PodcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  selectedModel: AIModel;
}

export default function PodcastModal({
  isOpen,
  onClose,
  selectedText,
  selectedModel
}: PodcastModalProps) {
  const [customInstructions, setCustomInstructions] = useState("");
  const [useCustom, setUseCustom] = useState(false);
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
    setCustomInstructions("");
    setUseCustom(false);
    onClose();
  };

  const generatePodcast = async () => {
    if (!selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please select some text to create a podcast.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Generate script and audio in one API call
      const response = await apiRequest("/api/generate-podcast", {
        method: "POST",
        body: JSON.stringify({
          text: selectedText,
          model: selectedModel,
          customInstructions: useCustom ? customInstructions : undefined
        })
      });

      const data = await response.json();
      if (data.audioUrl) {
        setAudioUrl(data.audioUrl);
        toast({
          title: "Podcast generated!",
          description: "Your podcast is ready to play."
        });
      } else {
        throw new Error("No audio URL received");
      }
    } catch (error) {
      console.error("Error generating podcast:", error);
      toast({
        title: "Error",
        description: "Failed to generate podcast. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
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
            title: "Playback Error",
            description: "Failed to play audio.",
            variant: "destructive"
          });
          setIsPlaying(false);
        });
        newAudio.play();
        setIsPlaying(true);
        setAudio(newAudio);
      }
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Generate Podcast
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Text Preview */}
          <div>
            <Label className="text-sm font-medium">Selected Text</Label>
            <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md max-h-32 overflow-y-auto text-sm">
              {selectedText.substring(0, 300)}
              {selectedText.length > 300 && "..."}
            </div>
          </div>

          {/* Instructions Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="default"
                name="instructionType"
                checked={!useCustom}
                onChange={() => setUseCustom(false)}
                className="w-4 h-4"
              />
              <Label htmlFor="default" className="text-sm">
                Default: Overview + Analysis + Key Insights + Notable Quotes
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="custom"
                name="instructionType"
                checked={useCustom}
                onChange={() => setUseCustom(true)}
                className="w-4 h-4"
              />
              <Label htmlFor="custom" className="text-sm">
                Custom Instructions
              </Label>
            </div>

            {useCustom && (
              <Textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Enter your custom instructions for the podcast content..."
                className="min-h-[80px]"
              />
            )}
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generatePodcast} 
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Podcast...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                Generate Podcast
              </>
            )}
          </Button>

          {/* Audio Player */}
          {audioUrl && (
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Your Podcast</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}