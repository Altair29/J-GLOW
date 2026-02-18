import { DiagnosisQuestion, QuestionOption } from './database';

export type DiagnosisStep = {
  questionIndex: number;
  totalQuestions: number;
  question: DiagnosisQuestion;
  categoryName: string;
};

export type DiagnosisAnswer = {
  questionId: number;
  selectedValue: string;
  selectedOption: QuestionOption;
};

export type DiagnosisProgress = {
  currentStep: number;
  totalSteps: number;
  categoryProgress: Record<string, { answered: number; total: number }>;
};

export type AnalysisRequest = {
  sessionId: string;
  answers: Record<string, string>;
  scores: Record<string, number>;
};

export type AnalysisResponse = {
  reportId: string;
  summary: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  categories: {
    name: string;
    score: number;
    maxScore: number;
    analysis: string;
    recommendations: string[];
  }[];
};
