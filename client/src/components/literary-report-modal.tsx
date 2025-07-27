import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Download, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { copyToClipboard, downloadTXT } from "@/lib/utils";
import { AIModel } from "@shared/schema";

interface LiteraryReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  contextText: string;
  selectedModel: AIModel;
}

export default function LiteraryReportModal({
  isOpen,
  onClose,
  selectedText,
  contextText,
  selectedModel
}: LiteraryReportModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const { toast } = useToast();

  const handleClose = () => {
    setReport(null);
    onClose();
  };

  const generateReport = async () => {
    if (!selectedText.trim()) {
      toast({
        title: "No text selected",
        description: "Please select some text to create a literary report.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await apiRequest("/api/generate-literary-report", {
        method: "POST",
        body: JSON.stringify({
          text: selectedText,
          contextText: contextText,
          model: selectedModel
        })
      });

      const data = await response.json();
      if (data.report) {
        setReport(data.report);
        toast({
          title: "Literary report generated!",
          description: "Your analysis is ready to view."
        });
      } else {
        throw new Error("No report content received");
      }
    } catch (error) {
      console.error("Error generating literary report:", error);
      toast({
        title: "Generation failed",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!report) return;
    const success = await copyToClipboard(report);
    if (success) {
      toast({ title: "Copied to clipboard" });
    } else {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!report) return;
    downloadTXT(report, "literary-report.txt");
    toast({ title: "Report downloaded successfully" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-600" />
            <span>Literary Report</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Selected Text Preview */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Analyzing Passage:</h4>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-3 border border-blue-200 dark:border-blue-800 max-h-24 overflow-y-auto">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                "{selectedText.substring(0, 200)}..."
              </p>
            </div>
          </div>

          {/* Generation Button */}
          {!report && (
            <Button
              onClick={generateReport}
              disabled={isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Literary Elements...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Literary Report
                </>
              )}
            </Button>
          )}

          {/* Report Display */}
          {report && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-foreground">Literary Analysis Report</h4>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDownload}
                    className="flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>

              <ScrollArea className="h-96 border rounded-lg">
                <div className="p-4 space-y-3 text-sm leading-relaxed whitespace-pre-wrap">
                  {report}
                </div>
              </ScrollArea>

              <Button
                onClick={() => {
                  setReport(null);
                  generateReport();
                }}
                variant="outline"
                className="w-full"
              >
                Generate New Report
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}