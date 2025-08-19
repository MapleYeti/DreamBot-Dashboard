# Card Component

The Card component provides a flexible container with consistent styling and spacing options.

## Props

- `children`: React nodes to render inside the card
- `isCollapsible`: Whether the card header is clickable to collapse/expand
- `isCollapsed`: Whether the card content is currently collapsed
- `onToggleCollapse`: Callback when collapse state changes
- `title`: Optional title displayed in the header
- `icon`: Optional icon displayed next to the title
- `headerActions`: Optional actions displayed in the header
- `footer`: Optional footer content
- `spacing`: Spacing variant - 'regular' | 'tight' | 'compact'
- `variant`: Background variant - 'default' | 'item'

## Usage Examples

### Basic Card

```tsx
<Card title="Basic Card">
  <p>This is a basic card with default styling.</p>
</Card>
```

### Item Background Card

```tsx
<Card title="Item Card" variant="item">
  <p>This card uses the item background color for subtle differentiation.</p>
</Card>
```

### Card with Custom Spacing

```tsx
<Card title="Compact Card" spacing="compact" variant="item">
  <p>This card uses compact spacing and item background.</p>
</Card>
```

### Collapsible Card

```tsx
<Card
  title="Collapsible Card"
  isCollapsible
  isCollapsed={isCollapsed}
  onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
>
  <p>This card can be collapsed and expanded.</p>
</Card>
```

## Background Variants

- **`default`**: Uses `--bg-card` (primary card background) and `--border-main`
- **`item`**: Uses `--bg-item` (subtle item background) and `--border-item` for cohesive styling

The item variant is perfect for:

- Nested cards within other cards
- Grouped content sections
- Subtle visual hierarchy
- Secondary information panels
