const initialFiltersState = {
  beregnetBarn: [],
  breddeCM: [null, null],
  brukervektMaksKG: [null, null],
  brukervektMinKG: [null, null],
  fyllmateriale: [],
  lengdeCM: [null, null],
  materialeTrekk: [],
  setebreddeMaksCM: [null, null],
  setebreddeMinCM: [null, null],
  setedybdeMaksCM: [null, null],
  setehoydeMaksCM: [null, null],
  setehoydeMinCM: [null, null],
  setedybdeMinCM: [null, null],
  totalVektKG: [null, null],
  leverandor: [],
  produktkategori: [],
  rammeavtale: [],
  delkontrakt: [],
}

export const initialSearchDataState = {
  searchTerm: '',
  isoCode: '',
  hasAgreementsOnly: false,
  filters: initialFiltersState,
  sortOrder: undefined,
}

export const initialAgreementSearchDataState = {
  searchTerm: '',
  filters: initialFiltersState,
  hidePictures: 'show-pictures',
}
