import { ScrollArea } from "@/components/ui/scroll-area";
import { bookContent as paperContent } from "@shared/book-content";

// Create a table of contents based on "The Death of Ivan Ilych" structure  
const createTableOfContents = () => {
  const tableOfContents: Array<{ id: string; title: string; level: number }> = [
    // All 17 sections matching the actual book content
    { id: "section-1", title: "I. The News of Death", level: 0 },
    { id: "section-2", title: "II. The Funeral and Friends", level: 0 },
    { id: "section-3", title: "III. The Pension Discussion", level: 0 },
    { id: "section-4", title: "IV. Ivan's Early Life", level: 0 },
    { id: "section-5", title: "V. Career and Marriage", level: 0 },
    { id: "section-6", title: "VI. The Move to Petersburg", level: 0 },
    { id: "section-7", title: "VII. The Accident", level: 0 },
    { id: "section-8", title: "VIII. The Illness Develops", level: 0 },
    { id: "section-9", title: "IX. Family Reactions", level: 0 },
    { id: "section-10", title: "X. The Growing Pain", level: 0 },
    { id: "section-11", title: "XI. Medical Consultations", level: 0 },
    { id: "section-12", title: "XII. Gerasim's Compassion", level: 0 },
    { id: "section-13", title: "XIII. Morning Routine", level: 0 },
    { id: "section-14", title: "XIV. The Specialist", level: 0 },
    { id: "section-15", title: "XV. Family's Evening Out", level: 0 },
    { id: "section-16", title: "XVI. The Final Days", level: 0 },
    { id: "section-17", title: "XVII. Death and Revelation", level: 0 }
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
            for (const el of Array.from(allElements)) {
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
