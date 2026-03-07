

## Fix Mock Phone Numbers in RevShare Financials

**File**: `src/pages/revshare/Financials.tsx` (lines 44-185)

All 20 agent phone numbers in the `agentTransactionsMap` use realistic-looking exchange numbers. Per project standards, the middle part must be `555`.

**Changes** — update each `phone:` value to use `555` in the exchange position while keeping the area codes:

| Agent | Current | Fixed |
|-------|---------|-------|
| Tatsiana Crawford | (207) 370-4821 | (207) 555-4821 |
| Kendra Campbell Borja LLC | (305) 482-1937 | (305) 555-1937 |
| Cindy A Ermeav-Williams | (941) 263-8104 | (941) 555-8104 |
| Brittany A Garcia PLLC | (480) 719-3562 | (480) 555-3562 |
| Autumn Ceniza | (619) 504-2718 | (619) 555-2718 |
| Cara Darea Silverthorne | (407) 831-5249 | (407) 555-5249 |
| Sarah Brennan | (506) 214-8730 | (506) 555-8730 |
| Allison Mireau | (201) 647-3912 | (201) 555-3912 |
| Seth Steven Rhyne | (843) 592-4017 | (843) 555-4017 |
| Susan A Thomas | (813) 428-6053 | (813) 555-6053 |
| Salvador Fernando Rivas Hernandez | (617) 283-9401 | (617) 555-9401 |
| Marcus Bell | (214) 750-3186 | (214) 555-3186 |
| Abby Moorman Andes | (770) 394-2810 | (770) 555-2810 |
| Ravi Ramachandran | (425) 610-8274 | (425) 555-8274 |
| Lindsey Ruth Sampier | (720) 341-5928 | (720) 555-5928 |
| Jennifer Horst | (916) 472-8301 | (916) 555-8301 |
| Christian Smith | (404) 629-1475 | (404) 555-1475 |
| Camille Anne Horvath | (954) 318-7042 | (954) 555-7042 |
| Sheri Morrison | (561) 903-4218 | (561) 555-4218 |
| Amanda Bowen | (253) 481-7630 | (253) 555-7630 |

Single file, straightforward find-and-replace on each `phone:` line.

