

## Change "Postal Code" to "ZIP Code" for US mode

Update `src/pages/agent/BrokerHub.tsx` to conditionally display "ZIP Code" when `brokerHubMode` is `"us"` and "Postal Code" when `"canada"`.

### Changes

**`src/pages/agent/BrokerHub.tsx`**
- Import `useDemoConfig` from `@/contexts/DemoConfigContext`
- Change the `postalCode` column header from `t("broker.postalCode")` to a conditional: use `"ZIP Code"` when US mode, `t("broker.postalCode")` (Postal Code) when CAN mode

