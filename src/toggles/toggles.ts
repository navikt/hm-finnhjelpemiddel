export const EXPECTED_TOGGLES = [
  'adminreg.test',
  'juledekorasjon',
  'finnhjelpemiddel.vis-tilbehor-og-reservedel-lister',
  'finnhjelpemiddel.feilbanner',
  'paaskepynt',
  'finnhjelpemiddel.visAlternativEdit',
  'finnhjelpemiddel.link-seksualteknisk-avtale'
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
    name: 'finnhjelpemiddel.visAlternativEdit',
    enabled: true,
  },
]
