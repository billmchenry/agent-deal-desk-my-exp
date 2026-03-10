

## Plan: Add Broker Hub Mode to Demo Config

Add a `BrokerHubMode` toggle (US / CAN) to the Demo Configuration sheet. No changes to the Broker Hub page itself — you'll wire that up manually.

### Files to change

**1. `src/contexts/DemoConfigContext.tsx`**
- Add type: `export type BrokerHubMode = "us" | "canada";`
- Add `brokerHubMode: BrokerHubMode` to `DemoConfig` interface (default: `"us"`)
- Add `setBrokerHubMode` setter following the same pattern as existing setters

**2. `src/components/layout/DemoConfigSheet.tsx`**
- Add a new "Broker Hub" section with a `Building` icon and two radio options:
  - **US** — "Default US experience — State Mentors"
  - **CAN** — "Canadian experience — Provincial Mentors"
- Place it after the Country section (or wherever feels logical)

That's it — just the toggle in the config system, nothing else.

