
export enum AppState {
  Welcome,
  Capture,
  Loading,
  Results,
  Error,
}

export interface ShoeSizeResult {
  length_mm: number;
  length_in: number;
  size_us_men: string;
  size_us_women: string;
  size_eu: string;
  size_uk: string;
}
