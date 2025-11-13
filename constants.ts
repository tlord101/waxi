// FIX: Import Page from types.ts to break circular dependency.
import { Page } from './types';

export const NAV_LINKS: { name: Page }[] = [
  { name: 'Home' },
  { name: 'Vehicles' },
  { name: 'Installment' },
  { name: 'Giveaway' },
  { name: 'About' },
  { name: 'Contact' },
];