import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { renderMathInElement, renderMathString } from "@/lib/math-renderer";
import { useTextSelection } from "@/hooks/use-text-selection";
import SelectionToolbar from "@/components/selection-toolbar";
import ChunkingModal from "@/components/chunking-modal";

import { bookContent as paperContent } from "@shared/book-content";
import { Copy, Lock } from "lucide-react";

interface DocumentContentProps {
  mathMode?: boolean;
  onTextSelectedForChat?: (text: string) => void;
  onRewriteFromSelection?: (text: string) => void;
  onPassageDiscussion?: (text: string) => void;
  onCreateStudyGuide?: (text: string) => void;
  onTestMe?: (text: string) => void;
}

export default function DocumentContent({ 
  mathMode = true, 
  onTextSelectedForChat, 
  onRewriteFromSelection, 
  onPassageDiscussion, 
  onCreateStudyGuide,
  onTestMe
}: DocumentContentProps) {
  const { selection, isSelecting, clearSelection, highlightSelection, removeHighlights } = useTextSelection();
  const [showChunkingModal, setShowChunkingModal] = useState(false);
  const [selectedTextForChunking, setSelectedTextForChunking] = useState("");


  // Math rendering is handled in processContentForMathMode function

  const handleAskQuestion = (text: string) => {
    // Check if text is large and needs chunking
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount > 1000) {
      // Open chunking modal for large selections
      setShowChunkingModal(true);
      setSelectedTextForChunking(text);
    } else {
      // For smaller texts, use normal selection
      if (onPassageDiscussion) {
        onPassageDiscussion(text);
      }
    }
    // Don't clear selection - let user choose other actions if needed
  };

  const handleSendToChat = (text: string) => {
    // Check if text is large and needs chunking
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount > 1000) {
      // Open chunking modal for large selections
      setShowChunkingModal(true);
      setSelectedTextForChunking(text);
    } else {
      // For smaller texts, use normal selection
      if (onTextSelectedForChat) {
        onTextSelectedForChat(text);
      }
    }
    // Don't clear selection - let user choose other actions if needed
  };

  const handleRewrite = (text: string) => {
    // Check if text is large and needs chunking
    const wordCount = text.split(/\s+/).length;
    
    if (wordCount > 1000) {
      // Open chunking modal for large selections
      setShowChunkingModal(true);
      setSelectedTextForChunking(text);
    } else {
      // For smaller texts, use normal selection
      if (onRewriteFromSelection) {
        onRewriteFromSelection(text);
      }
    }
    // Don't clear selection - let user choose other actions if needed
  };



  const handleCreateStudyGuide = (text: string) => {
    if (onCreateStudyGuide) {
      onCreateStudyGuide(text);
    }
    // Don't clear selection - let user choose other actions if needed
  };

  const handleTestMe = (text: string) => {
    if (onTestMe) {
      onTestMe(text);
    }
    // Don't clear selection - let user choose other actions if needed
  };





  const handleHighlight = () => {
    highlightSelection();
    clearSelection();
  };

  const handleSelectAll = () => {
    const documentContent = document.querySelector('[data-document-content]');
    if (documentContent) {
      const range = document.createRange();
      range.selectNodeContents(documentContent);
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
      
      // Get the full document text
      const fullText = paperContent.sections.map((section: any) => 
        `${section.title}\n\n${section.content}`
      ).join('\n\n');
      
      // Check if text is large (over 1000 words) and needs chunking
      const wordCount = fullText.split(/\s+/).length;
      
      if (wordCount > 1000) {
        // Open chunking modal for large selections
        setShowChunkingModal(true);
        setSelectedTextForChunking(fullText);
      } else {
        // For smaller texts, use normal selection
        if (onTextSelectedForChat) {
          onTextSelectedForChat(fullText);
        }
      }
    }
  };

  // Function to convert raw text content to properly formatted HTML
  const processContentForMathMode = (content: string) => {
    try {
      if (!content || typeof content !== 'string') {
        return content || '';
      }
      
      // Convert plain text to HTML with proper formatting
      let processedContent = content
        // First, escape any existing HTML to prevent double processing
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        
        // Convert line breaks to proper paragraphs
        .split('\n\n')
        .map(paragraph => {
          if (!paragraph.trim()) return '';
          
          // Check if this is a heading and add appropriate ID for AI Logic content
          if (paragraph.match(/^(The Concept of Inference|Traditional View|AI Perspective|Types of Inference|Entailment|Pattern Activation|Confirmation|Confidence Scores|Validity|Soundness|Reliability|Robustness|Types of Reasoning|Limitations|Capabilities|Processing Types|Knowledge|Traditional Logic Review|Basic AI Logic Notation|Pattern Recognition Operators|Confidence Scoring|Pattern Similarity|Chain of Thought|AI Logic Operators|Pattern Composition|Pattern Alternatives|Pattern Negation|AI Logic Principles|Key Differences|Model Theoretic|Embedding Spaces|Activation Patterns|Confidence Landscapes|Future Directions|Meta-Logical|Completeness|Consistency|Decidability|Tractability|Models|Traditional vs AI|Formal Models|Embedding Models|Interpretation|Exercises)/i)) {
            let headingId = '';
            const text = paragraph.trim();
            
            // Main concept mappings for AI Logic content
            if (text.includes('The Concept of Inference')) headingId = 'concept-inference';
            else if (text.includes('Traditional View')) headingId = 'traditional-view';
            else if (text.includes('AI Perspective')) headingId = 'ai-perspective';
            else if (text.includes('Types of Inference')) headingId = 'types-inference';
            else if (text.includes('Entailment') && text.includes('Pattern')) headingId = 'entailment-patterns';
            else if (text.includes('Confirmation') && text.includes('Confidence')) headingId = 'confirmation-confidence';
            else if (text.includes('Validity') && text.includes('Soundness')) headingId = 'validity-reliability';
            else if (text.includes('Types of Reasoning')) headingId = 'types-reasoning';
            else if (text.includes('Limitations') && text.includes('Capabilities')) headingId = 'limitations-capabilities';
            else if (text.includes('Processing Types')) headingId = 'processing-types';
            else if (text.includes('Nature of Knowledge')) headingId = 'knowledge-nature';
            
            // Notational Conventions section
            else if (text.includes('Traditional Logic Review')) headingId = 'traditional-review';
            else if (text.includes('Basic AI Logic Notation')) headingId = 'ai-notation';
            else if (text.includes('Pattern Recognition Operators')) headingId = 'pattern-operators';
            else if (text.includes('Confidence Scoring')) headingId = 'confidence-scoring';
            else if (text.includes('Pattern Similarity')) headingId = 'pattern-similarity';
            else if (text.includes('Chain of Thought')) headingId = 'chain-thought';
            else if (text.includes('AI Logic Operators')) headingId = 'ai-operators';
            else if (text.includes('Pattern Composition')) headingId = 'pattern-composition';
            else if (text.includes('Pattern Alternatives')) headingId = 'pattern-alternatives';
            else if (text.includes('Pattern Negation')) headingId = 'pattern-negation';
            else if (text.includes('AI Logic Principles')) headingId = 'ai-principles';
            else if (text.includes('Key Differences from Traditional Logic')) headingId = 'differences-traditional';
            else if (text.includes('Model Theoretic Considerations')) headingId = 'model-theory';
            else if (text.includes('Embedding Spaces')) headingId = 'embedding-spaces';
            else if (text.includes('Activation Patterns')) headingId = 'activation-patterns';
            else if (text.includes('Confidence Landscapes')) headingId = 'confidence-landscapes';
            else if (text.includes('Limitations and Future Directions')) headingId = 'future-directions';
            
            // Meta-logical and Models sections
            else if (text.includes('Meta-Logical Principles')) headingId = 'meta-logical';
            else if (text.includes('Completeness and Consistency')) headingId = 'completeness-consistency';
            else if (text.includes('Soundness vs. Reliability')) headingId = 'soundness-reliability';
            else if (text.includes('Decidability vs. Tractability')) headingId = 'decidability-tractability';
            else if (text.includes('Models: Traditional vs. AI Systems')) headingId = 'models-systems';
            else if (text.includes('Formal Models in Classical Logic')) headingId = 'formal-models';
            else if (text.includes('Embedding Models in AI Systems')) headingId = 'embedding-models';
            else if (text.includes('Interpretation vs. Activation')) headingId = 'interpretation-activation';
            else if (text.includes('Exercises')) headingId = 'exercises';
            
            return `<h2 id="${headingId}" class="text-xl font-semibold mb-4 mt-8 text-slate-900 dark:text-slate-100">${text}</h2>`;
          }
          
          // Check if this is a subheading (shorter titles)
          if (paragraph.match(/^[A-Z][^.]{5,50}$/) && !paragraph.includes('|') && !paragraph.includes('=')) {
            return `<h3 class="text-lg font-medium mb-3 mt-6 text-foreground">${paragraph.trim()}</h3>`;
          }
          
          // Check if this is a code block (contains ASCII art or circuit diagrams)
          if (paragraph.includes('```') || paragraph.includes('---|') || paragraph.includes('|AND|') || paragraph.includes('|OR|') || paragraph.includes('|NOT|')) {
            return `<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md my-4 overflow-x-auto text-sm font-mono text-slate-900 dark:text-slate-100">${paragraph.trim()}</pre>`;
          }
          
          // Check if this is a table (contains multiple | characters)
          if (paragraph.split('|').length > 4) {
            const lines = paragraph.trim().split('\n');
            const tableRows = lines.map(line => {
              if (line.includes('|')) {
                const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                return `<tr>${cells.map(cell => `<td class="border border-slate-400 dark:border-slate-600 px-3 py-2 text-center bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">${cell}</td>`).join('')}</tr>`;
              }
              return '';
            }).filter(row => row);
            
            if (tableRows.length > 0) {
              return `<table class="border-collapse border border-slate-400 dark:border-slate-600 my-6 mx-auto bg-white dark:bg-slate-800 shadow-sm"><tbody>${tableRows.join('')}</tbody></table>`;
            }
          }
          
          // Regular paragraph with improved styling
          return `<p class="mb-4 leading-relaxed text-slate-800 dark:text-slate-200">${paragraph.trim()}</p>`;
        })
        .filter(p => p)
        .join('');
      
      if (!mathMode) {
        // Remove LaTeX notation when math mode is off
        return processedContent
          .replace(/\$\$([^$]+)\$\$/g, '$1') // Remove display math delimiters
          .replace(/\$([^$]+)\$/g, '$1') // Remove inline math delimiters
          .replace(/\\sqrt\{([^}]+)\}/g, 'sqrt($1)') // Convert sqrt notation
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)') // Convert fractions
          .replace(/\\text\{([^}]+)\}/g, '$1') // Remove text commands
          .replace(/\\mathbb\{([^}]+)\}/g, '$1') // Remove mathbb
          .replace(/\\forall/g, 'for all') // Convert universal quantifier
          .replace(/\\Rightarrow/g, 'implies') // Convert implication
          .replace(/\\ldots/g, '...') // Convert ellipsis
          .replace(/\\times/g, '×'); // Convert multiplication
      } else {
        // Process LaTeX notation for rendering
        let processed = processedContent;
        // Replace display math blocks
        processed = processed.replace(/\$\$([^$]+)\$\$/g, (match, latex) => {
          if (!match || !latex) return match || '';
          return renderMathString(latex, true);
        });
        // Replace inline math
        processed = processed.replace(/\$([^$]+)\$/g, (match, latex) => {
          if (!match || !latex) return match || '';
          return renderMathString(latex, false);
        });
        return processed;
      }
    } catch (error) {
      console.error('Error processing content for math mode:', error);
      return content || '';
    }
  };

  return (
    <div className="bg-card overflow-hidden relative">
      {/* Select All Button */}
      <div className="absolute top-16 right-6 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="bg-white/90 hover:bg-white border border-gray-300 shadow-sm text-xs px-2 py-1 h-7"
        >
          <Copy className="w-3 h-3 mr-1" />
          Select All
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-160px)]">
        <div className="p-8 w-full max-w-6xl mx-auto" data-document-content>
          <article className="prose prose-xl max-w-none text-slate-900 dark:text-slate-100 w-full leading-relaxed select-text">
            {/* Document Title */}
            <header className="text-center mb-12">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {paperContent.title}
              </h1>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300 text-center">
                by {paperContent.author}
              </p>
            </header>

            {/* Full Document Content - No Paywall */}
            {paperContent.sections.map((section: any, index: number) => (
              <section key={section.id} id={section.id} className="mb-12">
                <div 
                  className={`text-slate-800 dark:text-slate-200 leading-relaxed prose prose-lg max-w-none ${mathMode ? 'document-math-content' : 'document-text-content'}`}
                  dangerouslySetInnerHTML={{ 
                    __html: processContentForMathMode(section.content) 
                  }}
                />
              </section>
            ))}
          </article>
        </div>
      </ScrollArea>
      
      {/* Selection Toolbar */}
      {selection && isSelecting && (
        <SelectionToolbar
          selectedText={selection.text}
          onAskQuestion={handleAskQuestion}
          onSendToChat={handleSendToChat}
          onRewrite={handleRewrite}
          onCreateStudyGuide={handleCreateStudyGuide}
          onTestMe={handleTestMe}
          onHighlight={handleHighlight}
          onClear={clearSelection}
        />
      )}

      {/* Chunking Modal */}
      <ChunkingModal
        isOpen={showChunkingModal}
        onClose={() => setShowChunkingModal(false)}
        text={selectedTextForChunking}
        onChunkAction={(chunk: string, chunkIndex: number, action: 'quiz' | 'chat' | 'rewrite' | 'study-guide' | 'student-test') => {
          if (action === 'chat' && onTextSelectedForChat) {
            onTextSelectedForChat(chunk);
          } else if (action === 'rewrite' && onRewriteFromSelection) {
            onRewriteFromSelection(chunk);
          }
        }}
      />
      

    </div>
  );
}