export interface KeywordData {
  psychological: string[];
  tactics: string[];
  searchPhrases: string[];
}

export interface TopicData {
  id: number;
  title: string;
  cat: string;
}

export interface AnalysisReport {
  positioning: string;
  style: string;
  linguistics: string;
  tone: string;
  structure: string;
}

export interface DeconstructionResult {
  theme: string;
  keywords: KeywordData;
  topics: TopicData[];
  analysis: AnalysisReport;
  isRealAI?: boolean;
}
