import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, Download, Volume2, X } from "lucide-react";

interface PodcastPlayerProps {
  audioUrl?: string;
  title: string;
  onClose?: () => void;
}

export default function PodcastPlayer({ audioUrl, title, onClose }: PodcastPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
    }
  }, [audioUrl]);

  const handlePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
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
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Audio element */}
        <audio
          ref={audioRef}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onEnded={() => {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentTime(0);
          }}
        />

        {/* Progress Bar */}
        {audioUrl && (
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
        )}

        {/* Control Buttons */}
        <div className="flex justify-center items-center space-x-2">
          <Button
            onClick={isPlaying ? handlePause : handlePlay}
            size="sm"
            disabled={!audioUrl}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
            disabled={!audioUrl}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        {audioUrl && (
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
        )}

        {!audioUrl && (
          <div className="text-center text-sm text-muted-foreground">
            Generate a podcast summary to play audio
          </div>
        )}
      </CardContent>
    </Card>
  );
}