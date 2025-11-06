# hm-finnhjelpemiddel

Frontend for søk og visning av hjelpemidler

Lever under:

- prod-gcp: https://finnhjelpemiddel.nav.no/
- dev-gcp: https://finnhjelpemiddel.intern.dev.nav.no/

Bygget på [nextjs](https://nextjs.org/).

## lokal utvikling

### Tilgang til Github Package Registry

Siden vi bruker avhengigheter som ligger i GPR,
så må man sette opp tilgang til GPR med en PAT (personal access token)
som har `read:packages`. Du kan [opprette PAT her](https://github.com/settings/tokens).
Dersom du har en PAT som du bruker for tilgang til maven-packages i github kan du gjenbruke denne.

I din `.bashrc` eller `.zshrc`, sett følgende miljøvariabel:

`export NPM_AUTH_TOKEN=<din PAT med read:packages>`

Tokenet må autoriseres for bruk mot navikt-organisasjonen i Github (configure SSO knappen ved siden av tokenet i GitHub)

### Portforward

Logg inn på gcloud:  
`gcloud auth login`

First time:  
`kubectl config set-context dev-gcp --namespace=teamdigihot`  
`kubectl config use-context dev-gcp --namespace=teamdigihot`

To get products locally from 8080:  
`kubectl port-forward $(kubectl get pods -l app=hm-grunndata-search -o custom-columns=:metadata.name) 8080`

#### To get alternative products from port 1338

Follow the guide to acquire an On Behalf Of-token (obo) in dev in the [nais-docs](https://doc.nais.io/auth/entra-id/how-to/generate/).

Run  
```bash
export DEV_TOKEN=<your token here>
kubectl port-forward $(kubectl get pods -l app=hm-grunndata-alternativprodukter -o custom-columns=:metadata.name) 1338:8080
```

### Run dev server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing pages by modifying the files. The page auto-updates as you edit the file.

### Feature toggles

Feature toggles er satt opp i [unleash](https://unleash.nais.io/).
Toggles kan kun brukes i client-komponenter per nå ved:

```
const featureFlags = useFeatureFlags()
const useNewFeature = featureFlags.isEnabled("toggleName")
```

Når toggle hentes er den _undefined_, og det lønner seg å håndetere i visningen.

Toggles administreres i unleash UI https://teamdigihot-unleash-web.iap.nav.cloud.nais.io/

Appen henter kun inn toggles definert i `src/utils/featureToggles.ts` så evt. nye toggles må legges til her.
