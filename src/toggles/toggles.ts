export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = ["adminreg.test", "juledekorasjon", "finnhjelpemiddel.vis-tilbehor-og-reservedel-lister"] as const;

export const LOCAL_TOGGLES = [{
  name: 'finnhjelpemiddel.vis-tilbehor-og-reservedel-lister',
  enabled: true,
}, {
  name: 'juledekorasjon',
  enabled: true,
}]
