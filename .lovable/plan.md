

## Remove White Line Between Logo and Navigation

The logo container (line 270) has `border-b border-border` which creates the white horizontal line separating it from the nav area. Simply remove that border class to make it look like a single continuous container.

### Change
In `src/components/layout/Sidebar.tsx` line 270, remove `border-b border-border` from the logo container's className.

