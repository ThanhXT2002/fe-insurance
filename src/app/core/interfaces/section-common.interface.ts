export interface SectionCommon<T> {
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


export interface OurTeamData{
  key: string;
  name: string;
  img: string;
  position: string;
  description: string;
}
