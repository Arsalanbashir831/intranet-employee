/**
 * Feature Card component types
 */

export type BadgeItem =
  | string
  | number
  | { front: string | number; back?: string | number };

export type FeatureCardProps = {
  image?: string;
  title: string;
  description: string;
  link?: string;
  badgeLines?: [BadgeItem, BadgeItem, BadgeItem];
  className?: string;
  imgClassName?: string;
};
