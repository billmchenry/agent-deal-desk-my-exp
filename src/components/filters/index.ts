import { UniversalFilterBar as Bar } from "./UniversalFilterBar";
import { DateRangeFilter } from "./DateRangeFilter";
import { DropdownFilter } from "./DropdownFilter";
import { SearchFilter } from "./SearchFilter";
import { ToggleFilter } from "./ToggleFilter";
import { PillFilter } from "./PillFilter";

export type { DateRange } from "./DateRangeFilter";

// Attach sub-components for compound pattern
const UniversalFilterBar = Object.assign(Bar, {
  DateRange: DateRangeFilter,
  Dropdown: DropdownFilter,
  Search: SearchFilter,
  Toggle: ToggleFilter,
  Pills: PillFilter,
});

export { UniversalFilterBar };
