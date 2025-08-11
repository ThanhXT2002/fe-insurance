export interface TermData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: SectionCommon[];
}

export interface SectionCommon {
  id: string;
  heading: string;
  content: string[];
  processedContent?: Array<{type: 'paragraph' | 'list', items: string[]}>;
}
