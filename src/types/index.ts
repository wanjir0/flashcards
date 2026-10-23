export type Domain = 'Cloud Concepts' | 'Architecture' | 'Compute & Network' | 'Storage & Data' | 'Security & Identity' | 'Governance & Cost';
export type Mode = 'smart' | 'weak' | 'cram';
/** 0 = Again, 1 = Hard, 2 = Good, 3 = Easy */
export type Grade = 0 | 1 | 2 | 3;

export interface Card {
  id: string;
  domain: Domain;
  q: string;
  a: string;
  /** id of a commonly confused card, shown together when you miss this one */
  confusedWith?: string;
}
export interface Progress { box: number; due: number; seen: number; lapses: number; streak: number }
export type ProgressMap = Record<string, Progress>;
export interface Store { progress: ProgressMap; streakDays: number; lastDay: string }
