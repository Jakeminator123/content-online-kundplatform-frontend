# Statistikvyer och automatiskt urval

Befintlig KTH-demo har flera perspektiv under `/anvandning`: tid, produkter, publicister, skolor, förändringar, efterfrågan och förnyelser. Budget är ett åttonde perspektiv för kundadministratörer. Inga nya affärsflöden, datakällor eller externa skrivningar införs.

`lib/statistics.ts` projicerar underlaget på servern. Statistikkomponentens klientprops saknar ekonomiska fält för läsare. URL-parametern `vy` begränsas till tillåtna vyer och ger aldrig en extra behörighet. Syntetiska produktmått får inte tolkas som unika personer eller verifierad COUNTER-statistik. Årsbudget delad med januari–augustis användning är inte periodiserad kostnad per nedladdning.

`lib/statistics-policy.ts` har samma innehåll och version som `src/admin/statistics-policy.ts` i `content-online-platform`. Håll filerna synkroniserade vid policyändring. Det befintliga readiness-/chattjobbet i backend använder denna logik. Urvalet prioriterar minskad användning, efterfrågan utan tillgång och förnyelser inom 90 dagar. Varje val har en motivering. Positiva resultat väljs inte på bekostnad av varningssignaler. Saknad data behandlas inte som noll, och gammal period flaggas.

Cron och kundportal räknar ut samma policy vid körning respektive sidvisning; cronresultat sparas inte och kundportalen hämtar inte ett historiskt cronresultat. Detta är förklarbara regler, inte en LLM-prognos eller en liveanalys. Befintliga inloggningsmodeller och demoavgränsningar gäller oförändrat.

Verifiering: `npm run typecheck`, `npm test`, `npm run build`. CI kör dessutom Chromium mot en lokal instans med en uttryckligen tillfällig sessionsnyckel: samtliga vyer, budgetavgränsning, diagramval, länkar och mobilbredd.
