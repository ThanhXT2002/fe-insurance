export interface IntroCommon<T> {
  intro: introData;
  data: T[];
}

export interface OurApproachData {
  key: string;
  title: string;
  img: string;
  heading: string;
  features: string[];
}

export interface introData {
  title: string;
  firstText?: string;
  highlightText?: string;
  lastText?: string;
  description?: string;
  image?: string;
}
