export const ROLE_KEYS = ['farmer', 'distributor', 'retailer', 'consumer'] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  farmer: 'Farmer',
  distributor: 'Distributor',
  retailer: 'Retailer',
  consumer: 'Consumer',
};

export const ROLE_BADGE_VARIANTS: Record<RoleKey, 'default' | 'secondary' | 'outline'> = {
  farmer: 'default',
  distributor: 'secondary',
  retailer: 'outline',
  consumer: 'outline',
};

export const ROLE_KEY_TO_INDEX: Record<RoleKey, number> = {
  farmer: 0,
  distributor: 1,
  retailer: 2,
  consumer: 3,
};

export const ROLE_INDEX_TO_KEY = {
  0: 'farmer',
  1: 'distributor',
  2: 'retailer',
  3: 'consumer',
} as const satisfies Record<number, RoleKey>;

export const HUMAN_ROLE_NAMES = ROLE_KEYS.map((key) => ROLE_LABELS[key]);

