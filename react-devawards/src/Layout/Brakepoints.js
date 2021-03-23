const windowWidth = {
  extraSmall: '599px',
  small: '600px',
  medium: '900px',
  large: '1200px',
  wide: '1800px'
};

export const device = {
  mobile: `(max-width: ${windowWidth.extraSmall})`,
  tabletPortrait: `(min-width: ${windowWidth.small})`,
  tabletLandscape: `(min-width: ${windowWidth.medium})`,
  desktop: `(min-width: ${windowWidth.large})`,
  wideScreen: `(min-width: ${windowWidth.wide})`,
};
