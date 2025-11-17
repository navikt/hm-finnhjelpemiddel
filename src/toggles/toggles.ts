export const EXPECTED_TOGGLES = [
  'adminreg.test',
  'juledekorasjon',
  'finnhjelpemiddel.vis-tilbehor-og-reservedel-lister',
  'finnhjelpemiddel.feilbanner',
  'paaskepynt',
  'finnhjelpemiddel.link-seksualteknisk-avtale',
  'finnhjelpemiddel.vis-virker-sammen-med-products',
] as const

export const LOCAL_TOGGLES = [
  {
    name: 'finnhjelpemiddel.link-seksualteknisk-avtale',
    enabled: true,
  },
  {
    name: 'finnhjelpemiddel.vis-tilbehor-og-reservedel-lister',
    enabled: true,
  },
  {
    name: 'juledekorasjon',
    enabled: false,
  },
  {
    name: 'finnhjelpemiddel.feilbanner',
    enabled: false,
  },
  {
    name: 'paaskepynt',
    enabled: false,
  },
  {
    name: 'finnhjelpemiddel.vis-virker-sammen-med-products',
    enabled: true,
  },
  {
    name: 'finnhjelpemiddel.avtale-side.komponenttype-gruppering',
    enabled: true,
  }
]
