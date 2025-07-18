/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#2C5530'; // Dark green from color scheme
const tintColorDark = '#ABC2AB'; // Light green from color scheme

export const Colors = {
  light: {
    text: '#1B1B1B', // Dark from color scheme
    background: '#fff',
    tint: tintColorLight,
    icon: '#9B9B9B', // Gray from color scheme
    tabIconDefault: '#9B9B9B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#1B1B1B', // Dark from color scheme
    tint: tintColorDark,
    icon: '#9B9B9B',
    tabIconDefault: '#9B9B9B',
    tabIconSelected: tintColorDark,
  },
};
