# content-online-kundplatform-frontend

## Publicerad kundportal och separat Content Online-admin

Kundportalen finns på https://fokus-psi-sable.vercel.app/login och nås även från https://content-online-platform.vercel.app. Kundvyerna och KTH-demokontona ligger kvar i detta repo.

Content Online-admin finns i plattformsrepot på https://content-online-platform.vercel.app/admin/login. `/content-online` och `/content-online/login` i denna frontend redirectar dit; de öppnar inte längre den tidigare lokala personaldemon. Clerk och den interna serverkontrollerade adminbehörigheten delas inte med kundernas demosessioner.

Clerk är anslutet som utvecklingsinstans. Användar-/publicistadministration och beständig lagring återstår. Inga riktiga kunddata får anslutas till den befintliga demonstrationsinloggningen.

## Lokal körning och backendkoppling

Kör backendprojektets `npm run dev` på port 3000. Kör sedan `corepack pnpm install --frozen-lockfile` och `corepack pnpm dev` i detta repo. Frontend använder port 3001 och binder till 127.0.0.1.

- Kundernas demoinloggning: http://127.0.0.1:3001/login
- Content Onlines separata personalinloggning: https://content-online-platform.vercel.app/admin/login
- Kundernas anslutna vy: http://127.0.0.1:3001/kundservice

Äldre lokala personalhjälpare ligger kvar för regressionstest men är inte längre en navigerbar personalportal. Kunddemon använder fortsatt den lokala backendadaptern endast vid utvecklingskörning. Kundens cookie får aldrig ge Content Online-adminbehörighet.

Kunddemon mappar befintliga Hampus (admin) och Bibbi (staff) till backendens syntetiska kundadmin respektive kundläsare. Namnen är presentationskonton, inte riktiga KTH-konton. Kundläsaren får inte pris/CPD eller medlemslista från den anslutna vyn och ser endast egna ärenden. Personal får endast sin tilldelade testkund, org-a.

`/kundservice` hämtar i lokal utveckling resurser, statistik, användare och ärenden från backend. Övriga befintliga kundvyer använder fortfarande `lib/data.ts` med exempeldata. De två datamängderna är inte samma källa och deras siffror ska inte jämföras som verklig kundstatistik.

Alla data är syntetiska. Ärenden skapas via backend och sparas i minnet tills backend startas om. De skickas inte till Salesforce, Fortnox eller e-post. IEEE/MPS-mått redovisas med källdefinition; ingen gemensam standard för alla publicister förutsätts.

### Produktion

GitHub main deployas automatiskt till Vercel-projektet `fokus`. Personaldemon och anrop med demotokens är avstängda vid alla produktionsbyggen och i Vercels miljöer, även previews. Tokens kan endast skickas till den fasta loopbackadressen http://127.0.0.1:3000, och redirect följs inte.

Personalinloggningen är nu ansluten separat i plattformsrepot med Clerk och server-side allowlist. Det innebär inte att kund-API:t eller användar-/publicistadministrationen är anslutet. Den äldre kundinloggningen har fortfarande demonstrationskonton och en reservnyckel i koden; den ska ersättas innan verkliga kunddata ansluts. Den ger ingen åtkomst till den skyddade produktionsbackenden.

### Verifiering

`corepack pnpm test` testar sessionsformat, utgångstid, återkallande, separation mellan kund/personal, tenantgränser, nekad demokörning i produktion, läsarbehörighet och felhantering. `corepack pnpm typecheck` och `corepack pnpm build` kontrollerar typer och produktion. Bygget stoppar nu även vid typfel.

Tidigare lokala regressionstester omfattade delade syntetiska tickets mellan kund och operatör. Den aktuella publicerade gränsen är i stället kunddemo → separat Content Online-inloggning. Första administratören måste själv verifiera sin e-post hos Clerk. Kundsessionen får inte ge åtkomst till plattformens `/admin/api/*`.

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_cohmoaLcgRIVCmwQmICDqqYDbIeQ)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://127.0.0.1:3001](http://127.0.0.1:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.


## Visuell MVP / september 2026

- Kundportalen har en gemensam design för KTH:s överblick, produkter, nyttjande, dokument, kundservice och kundadministration.
- Produktkorten har sökning, typfilter, detaljer och CSV-export med uttrycklig demomärkning, källa, period och definition. CSV-exporten gäller aktuellt filter.
- Dokument öppnar en förhandsvisning av syntetisk metadata; det finns inga uppladdade originalfiler. Avtal/fakturor döljs för läsaren i dokumentvyn och överblicken.
- Kundservice i publicerad demo visar ett formulär med förhandsvisning. Inget ärende skickas eller sparas; formulärets text försvinner vid omladdning. Lokal backendintegration behålls för lokal utveckling.
- Månadsgrafen använder januari–augusti 2026, med summor som stämmer med syntetisk produktportfölj och skoluppdelning.
- Exempelnyheter, priser, dokument och användning är påhittade. Kundauth är fortfarande demonstrationsauth. Ingen riktig kundinformation ska kopplas in innan serververifierad identitet och beständiga medlemskap är klara.
- Content Onlines separata publika visningsdemo: https://content-online-platform.vercel.app/demo. Den ger inte behörighet till interna admin-API:er.

Verifiering: `npm run typecheck`, `npm test`, `npm run build`.
