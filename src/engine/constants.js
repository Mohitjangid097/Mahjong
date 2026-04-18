export const SUITS = ['bamboo', 'characters', 'dots'];
export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const DRAGONS = ['red', 'green', 'white'];
export const WINDS = ['east', 'south', 'west', 'north'];

export const HAND_SIZE = 5;
export const COPIES_PER_TILE = 4;
export const BASE_SPECIAL_VALUE = 5;
export const MIN_TILE_VALUE = 0;
export const MAX_TILE_VALUE = 10;
export const MAX_RESHUFFLES = 3;

export const TILE_SYMBOLS = {
  bamboo: { 1: '\u{1F010}', 2: '\u{1F011}', 3: '\u{1F012}', 4: '\u{1F013}', 5: '\u{1F014}', 6: '\u{1F015}', 7: '\u{1F016}', 8: '\u{1F017}', 9: '\u{1F018}' },
  characters: { 1: '\u{1F007}', 2: '\u{1F008}', 3: '\u{1F009}', 4: '\u{1F00A}', 5: '\u{1F00B}', 6: '\u{1F00C}', 7: '\u{1F00D}', 8: '\u{1F00E}', 9: '\u{1F00F}' },
  dots: { 1: '\u{1F019}', 2: '\u{1F01A}', 3: '\u{1F01B}', 4: '\u{1F01C}', 5: '\u{1F01D}', 6: '\u{1F01E}', 7: '\u{1F01F}', 8: '\u{1F020}', 9: '\u{1F021}' },
  wind: { east: '\u{1F000}', south: '\u{1F001}', west: '\u{1F002}', north: '\u{1F003}' },
  dragon: { red: '\u{1F004}', green: '\u{1F005}', white: '\u{1F006}' },
};

export const TILE_LABELS = {
  bamboo: 'Bamboo',
  characters: 'Characters',
  dots: 'Dots',
  wind: 'Wind',
  dragon: 'Dragon',
};
