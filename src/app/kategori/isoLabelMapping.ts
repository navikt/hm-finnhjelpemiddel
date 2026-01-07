export const isoLabelMapping: Record<string, string> = {
  // Manuelle rullestoler
  '12220301': 'Aktive',
  '12220302': 'Allround',
  '12220303': 'Komfort',
  '12220304': 'Ståfunksjon',
  '12220305': 'Sport og fritid',
  // Elektriske rullestoler
  '12230602': 'Motorisert styring begrenset utebruk',
  '12230301': 'Manuell styring utebruk',
  '12230603': 'Motorisert styring innebruk',
  '12230601': 'Motorisert styring utebruk',
  '12230303': 'Manuell styring begrenset utebruk',
  '12230304': 'Manuell styring innebruk',
  // Drivaggregat
  '12240902': 'Manuell styring',
  '12240901': 'Motorisert styring',
  '12240903': 'Brukerstyrt styring',
  // Trehjulssykler
  '12180603': 'Hjelpemotor',
  '12180607': 'Fast nav',
  '12180604': 'Pedalbrems',
  '12180608': 'Frinav',
  '12180602': 'Fotpedaler og to forhjul',
}

export const getIsoLabel = (key: string, fallback: string): string => {
  return isoLabelMapping[key] ?? fallback
}
