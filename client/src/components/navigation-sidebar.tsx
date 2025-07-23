import { ScrollArea } from "@/components/ui/scroll-area";
import { bookContent as paperContent } from "@shared/book-content";

// Create a table of contents based on the actual Ethics content structure
const createTableOfContents = () => {
  const tableOfContents: Array<{ id: string; title: string; level: number }> = [
    // All 16 main sections
    { id: "section-1", title: "1.0 What is ethics?", level: 0 },
    { id: "section-2", title: "2.0 Two kinds of goodness: instrumental and intrinsic", level: 0 },
    { id: "section-2-1", title: "2.1 Instrumental and intrinsic goodness not mutually exclusive", level: 1 },
    { id: "section-3", title: "3.0 More meanings of 'good': goodness vs. commendableness", level: 0 },
    { id: "section-3-1", title: "3.1 Two kinds of intrinsic badness", level: 1 },
    { id: "section-4", title: "4.0 The morally complex structure of some situations", level: 0 },
    { id: "section-5", title: "5.0 The non-privative character of moral attributes", level: 0 },
    { id: "section-6", title: "6.0 A corollary of the non-binary nature of moral attributes", level: 0 },
    { id: "section-6-1", title: "6.1 For one moral obligation to outweigh another is not for it to cancel it", level: 1 },
    { id: "section-6-2", title: "6.2 'right' ≠ 'good', 'right' = 'least bad'", level: 1 },
    { id: "section-6-3", title: "6.3 'wrong' ≠ 'bad', 'wrong' = 'least good'", level: 1 },
    { id: "section-7", title: "7.0 'Ought' implies 'can'", level: 0 },
    { id: "section-8", title: "8.0 Legality ≠ morality", level: 0 },
    { id: "section-9", title: "9.0 The moral status of passing judgment on X ≠ to the moral status of X itself", level: 0 },
    { id: "section-10", title: "10.0 The goodness of the act vs. the goodness of the agent", level: 0 },
    { id: "section-11", title: "11.0 Why many legal systems punish attempted crimes less severely", level: 0 },
    { id: "section-12", title: "12.0 Aren't there people who are to be condemned even though it is their intention to do good?", level: 0 },
    { id: "section-13", title: "13.0 Can one act immorally towards oneself?", level: 0 },
    { id: "section-14", title: "14.0 Some metaethical principles", level: 0 },
    { id: "section-14-1", title: "14.1 You can't derive an 'ought' from an 'is'", level: 1 },
    { id: "section-14-2", title: "14.2 Moore's 'open question' argument", level: 1 },
    { id: "section-14-2-1", title: "14.2.1 Commentary on the last two principles", level: 2 },
    { id: "section-14-3", title: "14.3 'Ought' implies 'can'", level: 1 },
    { id: "section-14-4", title: "14.4 Genetic questions must be distinguished from normative questions", level: 1 },
    { id: "section-14-5", title: "14.5 Questions concerning the use to which supposed moral truths are put", level: 1 },
    { id: "section-14-6", title: "14.6 Questions concerning morality must be separated from questions concerning implementation", level: 1 },
    { id: "section-15", title: "15.0 Some bad reasons to reject ethical realism", level: 0 },
    { id: "section-15-1", title: "15.1 Discussion of (i)", level: 1 },
    { id: "section-15-2", title: "15.2 Discussion of (ii)", level: 1 },
    { id: "section-15-3", title: "15.3 Discussion of (iii)", level: 1 },
    { id: "section-15-4", title: "15.4 Discussion of (iv)", level: 1 },
    { id: "section-16", title: "16.0 What are ethical truths?", level: 0 }
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
