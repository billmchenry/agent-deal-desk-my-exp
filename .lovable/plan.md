

## Streamline Transaction Table Filtering

Replace the seven per-column "Contains" filter inputs with a clean toolbar containing a single search bar and a status dropdown.

### New Toolbar Layout

```text
Transactions    [All Statuses v]  [Search transactions...]  [Download]  5 Results
```

### Changes

**File: `src/components/agent/MasterTransactionTable.tsx`**

1. **Replace filter state** -- remove the seven individual filter keys, replace with two states:
   - `search` (string) -- global text search
   - `statusFilter` (string) -- "all" | "paid" | "pending" | "withdrawn"

2. **Update filtering logic** -- filter rows by:
   - Status: exact match against `statusFilter` (skip if "all")
   - Search: case-insensitive match against transaction ID, address, sale price, GCI, close date, and cap amount

3. **Move controls into sticky header** -- place the status `<Select>` dropdown and search `<Input>` into the existing sticky header bar, alongside the Download button and result count

4. **Remove the filter `<TableRow>`** -- delete the entire second header row that currently renders seven filter inputs

5. **Add imports** -- add `Search` icon from lucide-react, and `Select`/`SelectTrigger`/`SelectContent`/`SelectItem`/`SelectValue` from the UI library

### Status Dropdown Options
- All Statuses (default, shows everything)
- Paid
- Pending
- Withdrawn

### Result

- Table header goes from 2 rows to 1 -- much cleaner
- Filtering is intuitive: type anything in search, or pick a status from the dropdown
- Consistent with the streamlined approach used in the capping history table
