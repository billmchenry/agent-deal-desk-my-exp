

## Update Mock Data: Primary State License

Change all `primaryStateLicense` values in `src/data/mentorMockData.ts` to only the two-letter state abbreviation (remove the dash and numbers).

### Changes

In `src/data/mentorMockData.ts`, update each entry:

| Current | New |
|---------|-----|
| `TX-782341` | `TX` |
| `CA-019283` | `CA` |
| `TN-445901` | `TN` |
| `GA-338102` | `GA` |
| `OR-220194` | `OR` |
| `FL-990832` | `FL` |
| `NV-112039` | `NV` |
| `WA-554012` | `WA` |
| `AZ-882014` | `AZ` |
| `TX-443092` | `TX` |

This also means the `render` function added previously to the `BrokerHub.tsx` column definition (which splits on "-") becomes unnecessary but harmless — it can optionally be removed for cleanliness.

