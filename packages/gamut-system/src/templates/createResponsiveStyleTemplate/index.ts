import {
  assign,
  entries,
  get,
  isArray,
  isObject,
  pick,
  set,
  values,
} from 'lodash';

import {
  AbstractProps,
  AbstractTheme,
  HandlerMeta,
  StyleTemplate,
} from '../../types/config';
import { CSSObject } from '../../types/css';
import { BASE, DEFAULT_MEDIA_QUERIES, GLOBAL_PROPERTIES } from './constants';

export function createResponsiveStyleTemplate<
  Props extends { theme?: AbstractTheme }
>({
  propNames,
  styleTemplates,
}: HandlerMeta<Props>): (props: Props) => CSSObject {
  return ({ theme = {}, ...props }) => {
    const { breakpoints = DEFAULT_MEDIA_QUERIES } = theme;

    const breakpointOrder = [BASE, ...Object.keys(breakpoints)];
    const responsive = {} as Record<typeof breakpointOrder[number], Props>;

    GLOBAL_PROPERTIES.forEach((global) => {
      const value = get(props, global);

      if (value !== undefined) {
        set(responsive, [BASE, global as any], value);
      }
    });

    // Iterate through all responsible props and create a base style configuration.
    propNames.forEach((propName) => {
      const propertyValue = props[propName];

      // Handle responsive configurations properly.
      switch (typeof propertyValue) {
        case 'string':
        case 'number':
          // If no extra styles exist add this to the lowest breakpoint
          return set(responsive, [BASE, propName], propertyValue);
        case 'object': {
          // Add to the config if it is an array of prop values
          if (isArray(propertyValue)) {
            return propertyValue.forEach((value, mediaIndex) => {
              if (value !== undefined) {
                return set(
                  responsive,
                  [breakpointOrder[mediaIndex], propName],
                  value
                );
              }
            });
          }
          // Add to the config if it is an object of sizes / values
          if (isObject(propertyValue)) {
            return entries(propertyValue).forEach(([mediaSize, value]) => {
              set(responsive, [mediaSize, propName], value);
            });
          }
        }
        default:
          return;
      }
    });

    let styles: CSSObject = {};

    // Iterate through each breakpoints sorted props
    entries(responsive).forEach(([breakpoint, bpProps]) => {
      const templates = values(
        styleTemplates
      ) as StyleTemplate<AbstractProps>[];

      // TODO: Only call the templateFns we have props for.1
      templates.forEach((styleFunction) => {
        if (!styleFunction) return;
        const templateStyles = {
          ...pick(bpProps, GLOBAL_PROPERTIES),
          ...styleFunction({ ...bpProps, theme }),
        };

        // Smallest sizes are always on by default
        if (breakpoint === breakpointOrder[0]) {
          styles = assign(styles, templateStyles);
        } else {
          // For all sizes higher, create a new media object.
          const breakpointKey =
            breakpoints[breakpoint as keyof typeof breakpoints];
          styles[breakpointKey] = assign(styles[breakpointKey], templateStyles);
        }
      });
    });

    return styles;
  };
}