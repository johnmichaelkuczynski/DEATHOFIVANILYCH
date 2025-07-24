import { ScrollArea } from "@/components/ui/scroll-area";
import { bookContent as paperContent } from "@shared/book-content";

// Create a table of contents based on the actual book content structure
const createTableOfContents = () => {
  const tableOfContents: Array<{ id: string; title: string; level: number }> = [
    // Part One
    { id: "part-one", title: "Part One", level: 0 },
    { id: "chapter-1", title: "Chapter I. The Bertolini", level: 1 },
    { id: "chapter-2", title: "Chapter II. In Santa Croce with No Baedeker", level: 1 },
    { id: "chapter-3", title: "Chapter III. Music, Violets, and the Letter \"S\"", level: 1 },
    { id: "chapter-4", title: "Chapter IV. Fourth Chapter", level: 1 },
    { id: "chapter-5", title: "Chapter V. Possibilities of a Pleasant Outing", level: 1 },
    { id: "chapter-6", title: "Chapter VI. The Reverend Arthur Beebe, the Reverend Cuthbert Eager, Mr. Emerson, Mr. George Emerson, Miss Eleanor Lavish, Miss Charlotte Bartlett, and Miss Lucy Honeychurch Drive Out in Carriages to See a View; Italians Drive Them", level: 1 },
    { id: "chapter-7", title: "Chapter VII. They Return", level: 1 },
    
    // Part Two
    { id: "part-two", title: "Part Two", level: 0 },
    { id: "chapter-8", title: "Chapter VIII. Medieval", level: 1 },
    { id: "chapter-9", title: "Chapter IX. Lucy As a Work of Art", level: 1 },
    { id: "chapter-10", title: "Chapter X. Cecil as a Humourist", level: 1 },
    { id: "chapter-11", title: "Chapter XI. In Mrs. Vyse's Well-Appointed Flat", level: 1 },
    { id: "chapter-12", title: "Chapter XII. Twelfth Chapter", level: 1 },
    { id: "chapter-13", title: "Chapter XIII. How Miss Bartlett's Boiler Was So Tiresome", level: 1 },
    { id: "chapter-14", title: "Chapter XIV. How Lucy Faced the External Situation Bravely", level: 1 },
    { id: "chapter-15", title: "Chapter XV. The Disaster Within", level: 1 },
    { id: "chapter-16", title: "Chapter XVI. Lying to George", level: 1 },
    { id: "chapter-17", title: "Chapter XVII. Lying to Cecil", level: 1 },
    { id: "chapter-18", title: "Chapter XVIII. Lying to Mr. Beebe, Mrs. Honeychurch, Freddy, and The Servants", level: 1 },
    { id: "chapter-19", title: "Chapter XIX. Lying to Mr. Emerson", level: 1 },
    { id: "chapter-20", title: "Chapter XX. The End of the Middle Ages", level: 1 }
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
