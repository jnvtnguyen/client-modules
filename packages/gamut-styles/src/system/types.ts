import { CSSObject, SerializedStyles } from '@emotion/core';
import { Styles } from 'polished/lib/types/style';
import * as CSS from 'csstype';

/** System Configuration */
export type MediaQueryArray<T> = [T?, T?, T?, T?, T?];

export type MediaQueryMap<T> = {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export type ResponsiveProp<T> = MediaQueryArray<T> | MediaQueryMap<T>;

/** Utility  */
export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

export type NeverUnknown<T> = T extends string
  ? T
  : T extends number
  ? T
  : T extends unknown
  ? never
  : T;

export type SafeLookup<T> = T extends Readonly<unknown[]> ? T[number] : never;
export type SafeMapKey<T> = T extends Readonly<Record<string, unknown>>
  ? keyof T
  : never;

/** Abstract Configurations  */
export type PropAlias = Readonly<keyof CSS.Properties>;

export type AnyStyle = SerializedStyles | Styles | string;

export type StyleMap = CSS.Properties;

export type AbstractTheme = Readonly<Partial<Record<string, ScaleArray>>>;

export type ScaleArray = Readonly<unknown[]>;

export type ScaleMap = Readonly<Record<string | number, unknown>>;

export type AbstractScales = ScaleArray | ScaleMap | Readonly<string>;

export type AbstractProps = Record<string, unknown>;

export type StyleTemplate<T extends AbstractProps> = (
  props: T
) => CSSObject | undefined;

export type TemplateMap<T extends AbstractProps> = Partial<
  Record<keyof T, StyleTemplate<T>>
>;

export type HandlerConfig<T extends AbstractProps> = {
  propName: keyof T;
  altProps?: Readonly<(keyof T)[]>;
  templateFn: StyleTemplate<T>;
};

export type Handler<T extends AbstractProps> = {
  propNames?: (keyof T)[];
  templateFns?: TemplateMap<T>;
} & ((props: T) => CSSObject);

export type HandlerProps<T extends Handler<AbstractProps>> = Parameters<T>[0];

export type PropTemplateType = 'standard' | 'directional';

export type TransformValue = (value: unknown) => string | number;
export type DirectionalConfig = {
  propName: PropAlias | Readonly<PropAlias[]>;
  altProps?: Readonly<string[]>;
  type: 'directional';
  scale?: AbstractScales;
  computeValue?: TransformValue;
};

export type StandardConfig = {
  propName: PropAlias | Readonly<PropAlias[]>;
  altProps?: Readonly<string[]>;
  type?: 'standard';
  scale?: AbstractScales;
  computeValue?: TransformValue;
};

export type AbstractSystemConfig = StandardConfig | DirectionalConfig;

/** Theme Aware Configurations */

export type ThematicConfig<T extends AbstractTheme> =
  | (StandardConfig & { scale?: ScaleArray | ScaleMap | Readonly<keyof T> })
  | (DirectionalConfig & { scale?: ScaleArray | ScaleMap | Readonly<keyof T> });

export type PropKey<T extends AbstractSystemConfig> =
  | Extract<T, { propName: string }>['propName']
  | Extract<T, { propName: Readonly<string[]> }>['propName'][number]
  | Extract<T, { altProps: Readonly<string[]> }>['altProps'][number];

type SafeCSSType<T extends PropAlias> = Extract<
  Readonly<CSS.Properties[T]>,
  Readonly<string>
>;

/** Standard CSS Property Types */
export type DefaultPropScale<
  T extends AbstractSystemConfig
> = T['propName'] extends PropAlias[]
  ? SafeCSSType<T['propName'][number]>
  : T['propName'] extends PropAlias
  ? SafeCSSType<T['propName']>
  : never;

export type ThematicScaleValue<
  T extends AbstractTheme,
  K extends ThematicConfig<T>
> = K['scale'] extends AbstractScales
  ?
      | NeverUnknown<SafeLookup<T[Extract<K, { scale: string }>['scale']]>>
      | SafeMapKey<Extract<K, { scale: ScaleMap }>['scale']>
      | Extract<K, { scale: ScaleArray }>['scale'][number]
  : DefaultPropScale<K>;

export type ThematicProps<
  T extends AbstractTheme,
  K extends ThematicConfig<T>
> = {
  [key in PropKey<K>]?:
    | ThematicScaleValue<T, K>
    | ResponsiveProp<ThematicScaleValue<T, K>>;
};
