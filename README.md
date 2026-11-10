# Pootmaat

Pootmaat helpt hondenbaasjes hondenweides in hun buurt ontdekken en speelafspraken maken.


GitHub repository: https://github.com/CasTimm/my-mobile-app 
Live PWA: https://joyful-kataifi-b8b4e7.netlify.app/



## Projectidee

- **Doelgroep:** hondenbaasjes in en rond Leuven die een geschikte hondenweide zoeken en hun hond met andere honden willen laten spelen.
- **Wat ik bouw:** een PWA met een overzicht van hondenweides en hun faciliteiten, beoordelingen en drukte; een detailpagina om een speelafspraak te bekijken; en een profielpagina om honden te beheren en mee te nemen naar een weide.
- **Onderscheid:** toekomstige functies zijn automatisch inchecken op basis van locatie en passende honden tonen die al op dezelfde weide zijn.
- **Concurrenten:** Doggo (hondenplekken en wandelingen), Dogu (hondencommunity en ontmoetingen) en algemene kaart- en wandelapps. Pootmaat richt zich op lokale hondenweide-informatie en speelmaatjes.


## Functionaliteit

- **Weideoverzicht:** weides zoeken en filteren.
- **Weidedetail:** faciliteiten en informatie over de weide bekijken; een of meer eigen honden selecteren en inschrijven.
- **Profiel:** honden lokaal aanmaken, bewerken en verwijderen.
- **Database:** de weidelijst en weidedetails worden gelezen uit de gehoste Supabase-tabel `public.parks`.

Hondenprofielen en inschrijvingen worden momenteel alleen lokaal in de browser bijgehouden; die worden niet naar Supabase verzonden. Er is nog geen login.

## Lokaal starten

Vereist: Node.js en npm.

```powershell
npm install
Copy-Item .env.example .env.local
```

Vul in `.env.local` de Supabase Project URL en publishable/anon key in:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Start daarna de ontwikkelserver:

```powershell
npm run web
```

Open de URL die Expo in de terminal toont (standaard `http://localhost:8081`). Als je `.env.local` aanpast terwijl Expo al draait, stop de server met `Ctrl+C` en start hem opnieuw zodat Expo de instellingen opnieuw inleest.

## Supabase controleren

1. Controleer in het Supabase-dashboard dat het project **Healthy/Active** is en dat `public.parks` rijen bevat.
2. Start de app met de lokale Supabase-waarden in `.env.local`.
3. De rijen uit `public.parks` moeten in het weideoverzicht verschijnen. Open een weide om ook de detailquery te controleren. Bij een verbindingsfout toont de app een foutmelding en een knop om opnieuw te proberen.
4. Controleer in Supabase bij **Logs** (API/Postgres, afhankelijk van de dashboardweergave) de verzoeken tijdens het laden.

De Supabase-clientkey is in een webapp zichtbaar en hoort daarom alleen met Row Level Security-beleid voor de beoogde toegang gebruikt te worden. De app heeft publieke leest toegang nodig voor de weides. Zet **nooit** een `service_role`- of geheime key in de app, `.env.local`-voorbeeldwaarden, README of GitHub.

`.env.local` bevat lokale instellingen en wordt door Git genegeerd. De docent kan via alleen de repository geen lokale `.env.local` gebruiken. Om de live databaseverbinding zonder eigen configuratie te beoordelen, moet de PWA naar een publieke HTTPS-host worden gedeployed met de twee `EXPO_PUBLIC_...` waarden als buildinstellingen. Die publishable clientwaarden zijn zichtbaar in de gebouwde website; RLS is dus noodzakelijk. Vervang bovenaan **Live PWA** door de echte HTTPS-URL zodra die gepubliceerd is.
