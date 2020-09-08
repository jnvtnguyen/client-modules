import { colors } from '@codecademy/gamut-styles';

const {
  white,
  standard: { navy, yellow },
} = colors;

export const CARD_VARIANTS = {
  yellow: {
    background: yellow,
    shadow: navy,
    text: navy,
    border: navy,
  },
  navy: {
    background: navy,
    shadow: white,
    text: white,
    border: navy,
  },
  white: {
    background: white,
    shadow: navy,
    text: navy,
    border: navy,
  },
};