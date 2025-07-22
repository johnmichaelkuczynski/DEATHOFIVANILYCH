import { ScrollArea } from "@/components/ui/scroll-area";
import { bookContent as paperContent } from "@shared/book-content";

// Create a table of contents based on the AI Logic content
const createTableOfContents = () => {
  const tableOfContents: Array<{ id: string; title: string; level: number }> = [
    // Core AI Logic Concepts
    { id: "section-1", title: "Section 1: The Concept of Inference", level: 0 },
    { id: "inference-traditional", title: "Traditional View of Inference", level: 1 },
    { id: "inference-ai", title: "AI Perspective on Inference", level: 1 },
    { id: "types-inference", title: "Types of Inference", level: 1 },
    
    // Pattern Recognition vs Logic
    { id: "entailment-patterns", title: "Entailment vs. Pattern Activation", level: 1 },
    { id: "confirmation-confidence", title: "Confirmation vs. Confidence Scores", level: 1 },
    { id: "validity-reliability", title: "Validity and Soundness vs. Reliability", level: 1 },
    
    // Reasoning Systems
    { id: "types-reasoning", title: "Types of Reasoning", level: 1 },
    { id: "limitations-capabilities", title: "Limitations and Capabilities", level: 1 },
    { id: "processing-types", title: "Processing Types", level: 1 },
    { id: "knowledge-nature", title: "The Nature of Knowledge", level: 1 },
    
    // Section 2: AI Logic Notation
    { id: "section-2", title: "Section 2: Notational Conventions", level: 0 },
    { id: "traditional-review", title: "Traditional Logic Review", level: 1 },
    { id: "ai-notation", title: "Basic AI Logic Notation", level: 1 },
    { id: "pattern-operators", title: "Pattern Recognition Operators", level: 1 },
    { id: "ai-operators", title: "AI Logic Operators", level: 1 },
    { id: "ai-principles", title: "AI Logic Principles", level: 1 },
    { id: "differences-traditional", title: "Key Differences from Traditional Logic", level: 1 },
    { id: "model-theory", title: "Model Theoretic Considerations", level: 1 },
    { id: "future-directions", title: "Limitations and Future Directions", level: 1 },
    
    // Exercises and Applications
    { id: "exercises", title: "Exercises and Practice Questions", level: 0 }
  ];
  
  return tableOfContents;
};

const tableOfContents = createTableOfContents();



export default function NavigationSidebar() {
  const handleNavClick = (id: string) => {
    console.log(`Clicking navigation item: ${id}`);
    
    // First try to find exact ID match
    let element = document.getElementById(id);
    console.log(`Found element by ID: ${!!element}`);
    
    // If not found, try to find the content by searching text
    if (!element) {
      const titleMap: { [key: string]: string } = {
        "section-1": "1.1 The Concept of Inference",
        "inference-traditional": "Traditional View",
        "inference-ai": "AI Perspective", 
        "types-inference": "1.2 Types of Inference",
        "entailment-patterns": "1.3 Entailment vs. Pattern Activation",
        "confirmation-confidence": "1.4 Confirmation vs. Confidence Scores",
        "validity-reliability": "1.5 Validity and Soundness vs. Reliability and Robustness",
        "types-reasoning": "1.6 Types of Reasoning",
        "limitations-capabilities": "1.7 Limitations and Capabilities",
        "processing-types": "1.8 Processing Types",
        "knowledge-nature": "1.9 The Nature of Knowledge",
        "section-2": "2.0 Notational Conventions for AI Logic",
        "traditional-review": "Traditional Logic Review",
        "ai-notation": "2.1 Basic AI Logic Notation",
        "pattern-operators": "Pattern Recognition Operators",
        "ai-operators": "2.2 AI Logic Operators",
        "ai-principles": "2.3 AI Logic Principles",
        "differences-traditional": "2.4 Key Differences from Traditional Logic",
        "model-theory": "2.5 Model Theoretic Considerations",
        "future-directions": "2.6 Limitations and Future Directions",
        "exercises": "Exercises: Traditional and AI Logic"
      };
      
      const searchText = titleMap[id];
      console.log(`Searching for text: ${searchText}`);
      
      if (searchText) {
        // Find all elements containing this text in the document content area
        const contentArea = document.querySelector('[data-document-content]');
        if (contentArea) {
          const allElements = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6, p');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i];
            const textContent = el.textContent || '';
            
            // Skip table of contents sections - look for actual lecture content
            // We want to skip the TOC entries and find the actual lecture headings/content
            if (textContent.includes(searchText) && 
                !textContent.includes('Table of Contents') && 
                !el.closest('.table-of-contents') &&
                // Skip short entries that are likely table of contents
                textContent.length > 100) {
              element = el as HTMLElement;
              console.log(`Found element by text search: ${el.tagName} - ${textContent.substring(0, 50)}...`);
              break;
            }
          }
        }
      }
    }
    
    if (element) {
      console.log(`Scrolling to element: ${element.tagName}#${element.id || 'no-id'}`);
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      
      // Add a temporary highlight to show the user where they landed
      element.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
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
                  className={`block w-full text-left px-2 py-1.5 text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 rounded transition-colors font-normal ${
                    entry.level === 0 ? 'text-slate-800 dark:text-slate-200' : 
                    entry.level === 1 ? 'pl-4 text-slate-700 dark:text-slate-300' : 
                    'pl-6 text-slate-700 dark:text-slate-300'
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
