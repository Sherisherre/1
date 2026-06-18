export interface BaseLink {
  href: string;
  text: string;
  icon: string;
  type?: string;
  specialAction?: 'ghim-fail' | string;
}

export interface Section {
  title: string;
  icon: string;
  links: BaseLink[];
}

export interface Department {
  title: string;
  icon: string;
  links: BaseLink[];
}

export interface Initiatives {
  title: string;
  icon: string;
  links: BaseLink[];
}

export interface CardData {
  category: 'college' | 'specializations' | 'levels';
  level: string; // 'college' | 'specializations' | 'level-1' | 'level-2' | 'level-3' | 'level-4' | 'level-5' | 'level-6'
  title: string;
  icon: string;
  type?: 'multi-department';
  links?: BaseLink[];
  sections?: Section[];
  initiatives?: Initiatives;
  departments?: Department[];
}

export interface PrimaryFilter {
  id: string;
  text: string;
}

export interface LevelFilter {
  id: string;
  text: string;
}
