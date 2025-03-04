import { type Region } from './types';

export const SUPPORTED_DOMAINS = {
  'relay.amazon.com': { region: 'US', unit: 'miles' },
  'relay.amazon.co.uk': { region: 'UK', unit: 'km' },
  'relay.amazon.de': { region: 'DE', unit: 'km' },
  'relay.amazon.es': { region: 'ES', unit: 'km' },
  'relay.amazon.fr': { region: 'FR', unit: 'km' },
  'relay.amazon.it': { region: 'IT', unit: 'km' },
  'relay.amazon.pl': { region: 'PL', unit: 'km' },
  'relay.amazon.in': { region: 'IN', unit: 'km' },
  'relay.amazon.cz': { region: 'CZ', unit: 'km' },
  'relay.amazon.co.jp': { region: 'JP', unit: 'km' },
} as const;

export type DomainInfo = {
  region: Region;
  unit: 'miles' | 'km';
};

export function getCurrentDomain(): string {
  return window.location.hostname;
}

export function getDomainInfo(): DomainInfo {
  const domain = getCurrentDomain();
  return SUPPORTED_DOMAINS[domain as keyof typeof SUPPORTED_DOMAINS] || SUPPORTED_DOMAINS['relay.amazon.com'];
}

export function formatDistance(value: string): string {
  const { unit } = getDomainInfo();
  return `${value} ${unit}`;
}

export function formatCurrency(value: string): string {
  const { region } = getDomainInfo();
  const numValue = parseFloat(value);
  
  return new Intl.NumberFormat(getLocaleFromRegion(region), {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numValue);
}

function getLocaleFromRegion(region: Region): string {
  const localeMap: Record<Region, string> = {
    US: 'en-US',
    UK: 'en-GB',
    DE: 'de-DE',
    ES: 'es-ES',
    FR: 'fr-FR',
    IT: 'it-IT',
    PL: 'pl-PL',
    IN: 'en-IN',
    CZ: 'cs-CZ',
    JP: 'ja-JP'
  };
  return localeMap[region];
}