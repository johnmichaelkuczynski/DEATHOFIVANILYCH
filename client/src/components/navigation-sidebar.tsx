import { ScrollArea } from "@/components/ui/scroll-area";
import { bookContent as paperContent } from "@shared/book-content";

// Create a table of contents based on the AI Logic content
const createTableOfContents = () => {
  const tableOfContents: Array<{ id: string; title: string; level: number }> = [
    // 1.0 Fundamental Concepts
    { id: "section-1", title: "1.0 The Fundamental Concepts of Logic: Traditional vs. AI Approaches", level: 0 },
    { id: "concept-inference", title: "1.1 The Concept of Inference", level: 1 },
    { id: "traditional-view", title: "Traditional View", level: 2 },
    { id: "ai-perspective", title: "AI Perspective", level: 2 },
    { id: "types-inference", title: "1.2 Types of Inference", level: 1 },
    { id: "entailment-patterns", title: "1.3 Entailment vs. Pattern Activation", level: 1 },
    { id: "confirmation-confidence", title: "1.4 Confirmation vs. Confidence Scores", level: 1 },
    { id: "validity-reliability", title: "1.5 Validity and Soundness vs. Reliability and Robustness", level: 1 },
    { id: "types-reasoning", title: "1.6 Types of Reasoning", level: 1 },
    { id: "limitations-capabilities", title: "1.7 Limitations and Capabilities", level: 1 },
    { id: "processing-types", title: "1.8 Processing Types", level: 1 },
    { id: "knowledge-nature", title: "1.9 The Nature of Knowledge", level: 1 },
    
    // 2.0 Notational Conventions
    { id: "section-2", title: "2.0 Notational Conventions for AI Logic", level: 0 },
    { id: "traditional-review", title: "Traditional Logic Review", level: 1 },
    { id: "ai-notation", title: "2.1 Basic AI Logic Notation", level: 1 },
    { id: "pattern-operators", title: "Pattern Recognition Operators", level: 2 },
    { id: "confidence-scoring", title: "Confidence Scoring", level: 2 },
    { id: "pattern-similarity", title: "Pattern Similarity", level: 2 },
    { id: "chain-thought", title: "Chain of Thought", level: 2 },
    { id: "ai-operators", title: "2.2 AI Logic Operators", level: 1 },
    { id: "pattern-composition", title: "Pattern Composition", level: 2 },
    { id: "pattern-alternatives", title: "Pattern Alternatives", level: 2 },
    { id: "pattern-negation", title: "Pattern Negation", level: 2 },
    { id: "ai-principles", title: "2.3 AI Logic Principles", level: 1 },
    { id: "differences-traditional", title: "2.4 Key Differences from Traditional Logic", level: 1 },
    { id: "model-theory", title: "2.5 Model Theoretic Considerations", level: 1 },
    { id: "embedding-spaces", title: "Embedding Spaces", level: 2 },
    { id: "activation-patterns", title: "Activation Patterns", level: 2 },
    { id: "confidence-landscapes", title: "Confidence Landscapes", level: 2 },
    { id: "future-directions", title: "2.6 Limitations and Future Directions", level: 1 },
    
    // 3.0 Meta-Logical Principles (placeholder for future expansion)
    { id: "meta-logical", title: "3.0 Meta-Logical Principles: Classical vs. AI Approaches", level: 0 },
    { id: "completeness-consistency", title: "3.1 Completeness and Consistency", level: 1 },
    { id: "soundness-reliability", title: "3.2 Soundness vs. Reliability", level: 1 },
    { id: "decidability-tractability", title: "3.3 Decidability vs. Tractability", level: 1 },
    
    // 4.0 Models (placeholder for future expansion)
    { id: "models-systems", title: "4.0 Models: Traditional vs. AI Systems", level: 0 },
    { id: "formal-models", title: "4.1 Formal Models in Classical Logic", level: 1 },
    { id: "embedding-models", title: "4.2 Embedding Models in AI Systems", level: 1 },
    { id: "interpretation-activation", title: "4.3 Interpretation vs. Activation", level: 1 },
    
    // Exercises and Applications
    { id: "exercises", title: "Exercises: Traditional and AI Logic", level: 0 }
  ];
  
  return tableOfContents;
};

const tableOfContents = createTableOfContents();



export default function NavigationSidebar() {
  const handleNavClick = (id: string) => {
    console.log(`Clicking navigation item: ${id}`);
    
    // First try to find exact ID match
    let element = document.getElementById(id);
    
    if (!element) {
      // If no direct ID match, search for text content that matches the navigation entry
      const entry = tableOfContents.find(item => item.id === id);
      if (entry) {
        const searchTerms = entry.title
          .replace(/^\d+\.\d*\s*/, '') // Remove numbering like "1.0", "2.1"
          .replace(/[()[\]{}]/g, '') // Remove brackets
          .split(/[:\-,]/) // Split on colons, dashes, commas
          .map(term => term.trim())
          .filter(term => term.length > 3); // Only meaningful words
        
        console.log(`Searching for terms: ${searchTerms.join(', ')}`);
        
        // Search within the document content area
        const contentArea = document.querySelector('[data-document-content]');
        if (contentArea) {
          const allElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div');
          
          for (const searchTerm of searchTerms) {
            for (const el of allElements) {
              const textContent = el.textContent || '';
              if (textContent.toLowerCase().includes(searchTerm.toLowerCase()) && 
                  textContent.length < 200) { // Prefer headings over long paragraphs
                element = el as HTMLElement;
                console.log(`Found by text search: "${searchTerm}" in ${el.tagName}`);
                break;
              }
            }
            if (element) break;
          }
        }
      }
    }
    
    if (element) {
      console.log(`Scrolling to element: ${element.tagName}#${element.id || 'no-id'}`);
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      });
      
      // Brief visual feedback
      const originalBg = element.style.backgroundColor;
      element.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        element.style.backgroundColor = originalBg;
      }, 1500);
    } else {
      console.log(`No element found for navigation ID: ${id}`);
    }
  };

  return (
    <aside className="w-48 bg-card shadow-sm border-r border-border sticky top-16 h-[calc(100vh-160px)]">
      <div className="p-3 h-full flex flex-col">
        <h3 className="font-inter font-semibold text-sm text-foreground mb-3 flex-shrink-0">
          Table of Contents
        </h3>
        <ScrollArea className="flex-1 h-full">
          <div className="pr-2">
            <nav className="space-y-1">
              {tableOfContents.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => handleNavClick(entry.id)}
                  className={`block w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded transition-colors ${
                    entry.level === 0 ? 'text-slate-800 dark:text-slate-200 font-semibold border-l-2 border-blue-500' : 
                    entry.level === 1 ? 'pl-4 text-slate-700 dark:text-slate-300 font-medium' : 
                    'pl-8 text-slate-600 dark:text-slate-400 font-normal'
                  }`}
                  title={entry.title}
                >
                  <span className="block text-xs leading-tight whitespace-normal">
                    {entry.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}
