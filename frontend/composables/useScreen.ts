export default function useScreen() {
  const breakpoints = useBreakpoints({
    xs: 400,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1440,
    hd: 1920,
  });

  return {
    breakpoints,

    /**
     * Above 400px
     */
    isXs: breakpoints.greaterOrEqual('xs'),

    /**
     * Above 640px
     */
    isSm: breakpoints.greaterOrEqual('sm'),

    /**
     * Above 768px
     */
    isMd: breakpoints.greaterOrEqual('md'),

    /**
     * Above 1024px
     */
    isLg: breakpoints.greaterOrEqual('lg'),

    /**
     * Above 1440px
     */
    isXl: breakpoints.greaterOrEqual('xl'),

    /**
     * Above 1920px
     */
    isHd: breakpoints.greaterOrEqual('hd'),
  };
}
