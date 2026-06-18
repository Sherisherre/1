import { CardData, PrimaryFilter, LevelFilter } from './types';

export const PRIMARY_FILTERS: PrimaryFilter[] = [
  { id: 'college', text: 'الكلية' },
  { id: 'levels', text: 'المستويات' }
];

export const LEVEL_FILTERS: LevelFilter[] = [
  { id: 'level-1', text: 'الأول' },
  { id: 'level-2', text: 'الثاني' },
  { id: 'level-3', text: 'الثالث' },
  { id: 'level-4', text: 'الرابع' },
  { id: 'level-5', text: 'الخامس' },
  { id: 'level-6', text: 'السادس' },
  { id: 'level-7', text: 'السابع' },
  { id: 'level-8', text: 'الثامن' }
];

export const PRESET_THEMES = {
  blue: '#2563eb', // Beautiful rich blue corresponding to Elegant Dark specification
  sky: '#0284c7',  // Clean corporate sky blue
  indigo: '#4f46e5' // Sleek tech indigo
};

export const SITE_DATA: CardData[] = [
  {
    category: 'college',
    level: 'college',
    title: 'المجموعات العامة',
    icon: 'fa-globe',
    sections: [
      {
        title: "كلية الحاسب",
        icon: "fa-university",
        links: [
          { href: "https://t.me/qassimuniversityc", type: "channel", icon: "fa-bullhorn", text: "قناة كلية الحاسب" },
          { href: "https://t.me/qassimuniversityIT", type: "group", icon: "fa-users", text: "مناقشة كلية الحاسب" }
        ]
      },
      {
        title: "حوسب",
        icon: "fa-laptop-code",
        links: [
          { href: "https://t.me/COC_QU_channel", type: "channel", icon: "fa-bullhorn", text: "قناة حوسب" },
          { href: "https://t.me/COC_QU", type: "group", icon: "fa-users", text: "مناقشة حوسب" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-1',
    title: 'المستوى الأول',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "مستديم",
        icon: "fa-star",
        links: [
          { href: "https://t.me/addlist/LH-wE8fs_4ExNjE0", type: "initiative", icon: "", text: "قنوات المواد" }
        ]
      },
      {
        title: "حوسب",
        icon: "fa-laptop-code",
        links: [
          { href: "https://t.me/hawsib1", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى الأول" },
          { href: "https://t.me/hawsib_1", type: "group", icon: "fa-users", text: "مناقشة المستوى الأول" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-2',
    title: 'المستوى الثاني',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "مستديم",
        icon: "fa-star",
        links: [
          { href: "https://t.me/addlist/UZHn4fPZTvI4ODBk", type: "initiative", icon: "", text: "قنوات المواد" }
        ]
      },
      {
        title: "حوسب",
        icon: "fa-laptop-code",
        links: [
          { href: "https://t.me/hawsib2", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى الثاني" },
          { href: "https://t.me/hawsib2", type: "group", icon: "fa-users", text: "مناقشة المستوى الثاني" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-3',
    title: 'المستوى الثالث',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "مستديم",
        icon: "fa-star",
        links: [
          { href: "https://t.me/addlist/WY-nb6Wz4EtkYjZk", type: "initiative", icon: "", text: "قنوات المواد" }
        ]
      },
      {
        title: "حوسب",
        icon: "fa-laptop-code",
        links: [
          { href: "https://t.me/hawsib3", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى الثالث" },
          { href: "https://t.me/hawsib_3", type: "group", icon: "fa-users", text: "مناقشة المستوى الثالث" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-4',
    title: 'المستوى الرابع',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "مستديم",
        icon: "fa-star",
        links: [
          { href: "https://t.me/addlist/ED-1PugxTU42NjE8", type: "initiative", icon: "", text: "قنوات المواد" }
        ]
      },
      {
        title: "حوسب",
        icon: "fa-laptop-code",
        links: [
          { href: "https://t.me/hawsib3", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى الرابع" },
          { href: "https://t.me/hawsib4", type: "group", icon: "fa-users", text: "مناقشة المستوى الرابع" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-5',
    title: 'المستوى الخامس',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "Moves",
        icon: "fa-route",
        links: [
          { href: "https://t.me/IT_5_moves", type: "initiative", icon: "fa-laptop", text: "IT" },
          { href: "https://t.me/Brightofcs5", type: "initiative", icon: "fa-code", text: "CS" },
          { href: "https://t.me/CEGOATS/1", type: "initiative", icon: "fa-microchip", text: "CE" }
        ]
      },
      {
        title: "مبادرات الدفعة",
        icon: "fa-lightbulb",
        links: [
          { href: "https://t.me/COMPUTERLEVEL5", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-6',
    title: 'المستوى السادس',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "Moves",
        icon: "fa-route",
        links: [
          { href: "https://t.me/COC_6_moves", type: "initiative", icon: "fa-graduation-cap", text: "جميع التخصصات" }
        ]
      },
      {
        title: "مبادرات الدفعة",
        icon: "fa-lightbulb",
        links: [
          { href: "https://t.me/computerlevel6", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-7',
    title: 'المستوى السابع',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "Moves",
        icon: "fa-route",
        links: [
          { href: "https://t.me/COC_7_moves", type: "initiative", icon: "fa-graduation-cap", text: "جميع التخصصات" }
        ]
      },
      {
        title: "مبادرات الدفعة",
        icon: "fa-lightbulb",
        links: [
          { href: "https://t.me/COMPUTERLEVEL_7", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى" }
        ]
      }
    ]
  },
  {
    category: 'levels',
    level: 'level-8',
    title: 'المستوى الثامن',
    icon: 'fa-layer-group',
    sections: [
      {
        title: "Moves",
        icon: "fa-route",
        links: [
          { href: "https://t.me/COC_8_moves", type: "initiative", icon: "fa-graduation-cap", text: "جميع التخصصات" }
        ]
      },
      {
        title: "مبادرات الدفعة",
        icon: "fa-lightbulb",
        links: [
          { href: "https://t.me/+e5BVsgTxwzE2YTQ0", type: "channel", icon: "fa-bullhorn", text: "قناة المستوى" }
        ]
      }
    ]
  }
];
