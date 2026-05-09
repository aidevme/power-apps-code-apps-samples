/** A supported Dataverse UI language. */
export interface ILanguage {
  /** LCID numeric locale code. */
  lcid: number
  /** ISO 3166-1 alpha-2 country code used to resolve the local flag image. */
  flagCode: string
  /** English name of the language. */
  englishName: string
  /** Native name of the language. */
  nativeName: string
}

/** All supported Dataverse UI languages ordered by LCID. */
export const LANGUAGES: ILanguage[] = [
  { lcid: 1033, flagCode: 'us', englishName: 'English',               nativeName: 'English'      },
  { lcid: 1029, flagCode: 'cz', englishName: 'Czech',                 nativeName: 'Čeština'      },
  { lcid: 1030, flagCode: 'dk', englishName: 'Danish',                nativeName: 'Dansk'        },
  { lcid: 1031, flagCode: 'de', englishName: 'German',                nativeName: 'Deutsch'      },
  { lcid: 1032, flagCode: 'gr', englishName: 'Greek',                 nativeName: 'Ελληνικά'    },
  { lcid: 1036, flagCode: 'fr', englishName: 'French',                nativeName: 'Français'     },
  { lcid: 1038, flagCode: 'hu', englishName: 'Hungarian',             nativeName: 'Magyar'       },
  { lcid: 1040, flagCode: 'it', englishName: 'Italian',               nativeName: 'Italiano'     },
  { lcid: 1041, flagCode: 'jp', englishName: 'Japanese',              nativeName: '日本語'        },
  { lcid: 1042, flagCode: 'kr', englishName: 'Korean',                nativeName: '한국어'        },
  { lcid: 1045, flagCode: 'pl', englishName: 'Polish',                nativeName: 'Polski'       },
  { lcid: 1049, flagCode: 'ru', englishName: 'Russian',               nativeName: 'Русский'      },
  { lcid: 1051, flagCode: 'sk', englishName: 'Slovak',                nativeName: 'Slovenčina'   },
  { lcid: 1053, flagCode: 'se', englishName: 'Swedish',               nativeName: 'Svenska'      },
  { lcid: 1058, flagCode: 'ua', englishName: 'Ukrainian',             nativeName: 'Українська'   },
  { lcid: 1066, flagCode: 'vn', englishName: 'Vietnamese',            nativeName: 'Tiếng Việt'  },
  { lcid: 2070, flagCode: 'pt', englishName: 'Portuguese (Portugal)', nativeName: 'Português'    },
  { lcid: 3082, flagCode: 'es', englishName: 'Spanish (Spain)',       nativeName: 'Español'      },
]
