# content-online-kundplatform-frontend

## Lokal körning och backendkoppling

Kör backendprojektets `npm run dev` på port 3000. Kör sedan `corepack pnpm install --frozen-lockfile` och `corepack pnpm dev` i detta repo. Frontend använder port 3001 och binder till 127.0.0.1.

- Kundernas demoinloggning: http://127.0.0.1:3001/login
- Content Onlines separata personalinloggning: http://127.0.0.1:3001/content-online/login
- Kundernas anslutna vy: http://127.0.0.1:3001/kundservice

Personalens lokala demo använder en egen ogenomskinlig session och cookie, separat från kundsessionen. Åtkomst till en kund kontrolleras mot backendens `/v1/me` och sedan igen av varje backendendpoint. En kundcookie ger inte personalbehörighet. Personalutloggning återkallar sessionen på servern.

Kunddemon mappar befintliga Hampus (admin) och Bibbi (staff) till backendens syntetiska kundadmin respektive kundläsare. Namnen är presentationskonton, inte riktiga KTH-konton. Kundläsaren får inte pris/CPD eller medlemslista från den anslutna vyn och ser endast egna ärenden. Personal får endast sin tilldelade testkund, org-a.

`/kundservice` och personalvyn hämtar resurser, statistik, användare och ärenden från backend. Övriga befintliga kundvyer använder fortfarande `lib/data.ts` med exempeldata. De två datamängderna är inte samma källa och deras siffror ska inte jämföras som verklig kundstatistik.

Alla data är syntetiska. Ärenden skapas via backend och sparas i minnet tills backend startas om. De skickas inte till Salesforce, Fortnox eller e-post. IEEE/MPS-mått redovisas med källdefinition; ingen gemensam standard för alla publicister förutsätts.

### Produktion

GitHub main deployas automatiskt till Vercel-projektet `fokus`. Personaldemon och anrop med demotokens är avstängda vid alla produktionsbyggen och i Vercels miljöer, även previews. Tokens kan endast skickas till den fasta loopbackadressen http://127.0.0.1:3000, och redirect följs inte.

Riktig personalinloggning behöver ännu anslutas till en identitetsleverantör och backendens OIDC-validering samt beständiga användare/medlemskap. Ingen sådan koppling har aktiverats. Den äldre kundinloggningen har fortfarande demonstrationskonton och en reservnyckel i koden; den ska ersättas innan verkliga kunddata ansluts. Den ger ingen åtkomst till den skyddade produktionsbackenden.

### Verifiering

`corepack pnpm test` testar sessionsformat, utgångstid, återkallande, separation mellan kund/personal, tenantgränser, nekad demokörning i produktion, läsarbehörighet och felhantering. `corepack pnpm typecheck` och `corepack pnpm build` kontrollerar typer och produktion. Bygget stoppar nu även vid typfel.

Browserflöde: logga in som kund → skapa ett syntetiskt ärende → öppna personaldemon → se samma ärende → logga ut personal → kontrollera att kundsessionen inte öppnar personalvyn. Testärenden kan finnas kvar i den lokala backendens minne efter verifieringen.

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
