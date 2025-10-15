# UI Components Library

A professional, reusable, and accessible UI component library built with React, TypeScript, and Tailwind CSS. This library follows industry-standard patterns similar to shadcn/ui.

## Table of Contents

- [Installation](#installation)
- [Components](#components)
  - [Button](#button)
  - [IconButton](#iconbutton)
  - [Input](#input)
  - [Label](#label)
  - [Select](#select)
  - [Checkbox](#checkbox)
  - [Card](#card)
  - [Spinner](#spinner)
  - [Alert](#alert)
  - [Table](#table)
  - [EmptyState](#emptystate)
  - [ConfirmDialog](#confirmdialog)
- [Utilities](#utilities)
- [Best Practices](#best-practices)

## Installation

All dependencies are already installed. The UI components use:

- `clsx` - For conditional class names
- `tailwind-merge` - For merging Tailwind CSS classes intelligently

## Components

### Button

A versatile button component with multiple variants and loading states.

**Props:**

- `variant?: "primary" | "secondary" | "danger" | "ghost" | "link"` - Visual style (default: "primary")
- `size?: "sm" | "md" | "lg"` - Button size (default: "md")
- `isLoading?: boolean` - Shows loading spinner (default: false)
- All standard HTML button attributes

**Usage:**

```tsx
import { Button } from "@/components/ui";

// Primary button
<Button onClick={handleClick}>Click me</Button>

// Loading state
<Button isLoading={loading}>Submit</Button>

// Different variants
<Button variant="secondary">Cancel</Button>
<Button variant="danger">Delete</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

---

### IconButton

An icon button component optimized for table actions and toolbar buttons with icons and text.

**Props:**

- `variant?: "ghost" | "primary" | "danger"` - Visual style (default: "ghost")
- `size?: "sm" | "md" | "lg"` - Button size (default: "md")
- `icon?: ReactNode` - Icon element to display
- `isLoading?: boolean` - Shows loading spinner (default: false)
- All standard HTML button attributes

**Usage:**

```tsx
import { IconButton } from "@/components/ui";

// With icon and text
<IconButton
  variant="primary"
  icon={<EditIcon />}
  onClick={handleEdit}
>
  Edit
</IconButton>

// Icon only
<IconButton
  variant="danger"
  icon={<TrashIcon />}
  aria-label="Delete item"
/>

// Loading state
<IconButton
  variant="ghost"
  icon={<SaveIcon />}
  isLoading={saving}
>
  Save
</IconButton>

// Different variants
<IconButton variant="ghost" icon={<MenuIcon />}>Menu</IconButton>
<IconButton variant="primary" icon={<EditIcon />}>Edit</IconButton>
<IconButton variant="danger" icon={<DeleteIcon />}>Delete</IconButton>
```

**Use Cases:**

- Table row actions (Edit, Delete, View)
- Toolbar buttons
- Compact action buttons with icons
- Floating action buttons

---

### Input

A styled input field with error state and icon support.

**Props:**

- `error?: string` - Error message to display
- `icon?: ReactNode` - Icon on the left side
- `rightIcon?: ReactNode` - Icon on the right side
- All standard HTML input attributes

**Usage:**

```tsx
import { Input } from "@/components/ui";

// Basic input
<Input placeholder="Enter text" />

// With error
<Input error="This field is required" />

// With icons
<Input
  icon={<SearchIcon />}
  placeholder="Search..."
/>

<Input
  rightIcon={<CheckIcon />}
  placeholder="Username"
/>
```

---

### Label

A form label component with required indicator support.

**Props:**

- `required?: boolean` - Shows red asterisk (default: false)
- All standard HTML label attributes

**Usage:**

```tsx
import { Label, Input } from "@/components/ui";

<div>
  <Label htmlFor="email" required>
    Email Address
  </Label>
  <Input id="email" type="email" />
</div>;
```

---

### Select

A styled select dropdown with error support.

**Props:**

- `error?: string` - Error message to display
- All standard HTML select attributes

**Usage:**

```tsx
import { Select } from "@/components/ui";

<Select value={value} onChange={handleChange}>
  <option value="">Select an option</option>
  <option value="1">Option 1</option>
  <option value="2">Option 2</option>
</Select>;
```

---

### Checkbox

A styled checkbox with optional label.

**Props:**

- `label?: string` - Text label next to checkbox
- All standard HTML input (type="checkbox") attributes

**Usage:**

```tsx
import { Checkbox } from "@/components/ui";

// With label (automatic wrapping)
<Checkbox
  label="I agree to terms"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
/>

// Without label (manual control)
<Checkbox checked={checked} onChange={handleChange} />
```

---

### Card

A container component with multiple variants and subcomponents.

**Subcomponents:**

- `Card` - Main container
- `CardHeader` - Header section with border
- `CardTitle` - Title heading
- `CardContent` - Main content area
- `CardFooter` - Footer section with border

**Props (Card):**

- `variant?: "default" | "bordered" | "elevated"` - Visual style (default: "default")
- All standard HTML div attributes

**Usage:**

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui";

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Different variants
<Card variant="bordered">Content</Card>
<Card variant="elevated">Content</Card>
```

---

### Spinner

A loading spinner component.

**Props:**

- `size?: "sm" | "md" | "lg"` - Spinner size (default: "md")
- All standard HTML div attributes

**Usage:**

```tsx
import { Spinner } from "@/components/ui";

<Spinner />
<Spinner size="sm" />
<Spinner size="lg" />
<Spinner className="text-red-500" />
```

---

### Alert

An alert/notification component with different variants.

**Props:**

- `variant?: "success" | "error" | "warning" | "info"` - Alert type (default: "info")
- `title?: string` - Alert title
- `icon?: ReactNode` - Custom icon (uses default if not provided)
- All standard HTML div attributes

**Usage:**

```tsx
import { Alert } from "@/components/ui";

<Alert variant="success" title="Success!">
  Your changes have been saved.
</Alert>

<Alert variant="error" title="Error">
  Something went wrong.
</Alert>

<Alert variant="warning">
  This action cannot be undone.
</Alert>

<Alert variant="info">
  New features available.
</Alert>
```

---

### Table

A set of table components for creating data tables.

**Subcomponents:**

- `Table` - Wrapper with overflow handling
- `TableHeader` - Table header section
- `TableBody` - Table body section
- `TableRow` - Table row
- `TableHead` - Header cell
- `TableCell` - Data cell

**Usage:**

```tsx
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui";

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Role</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>John Doe</TableCell>
      <TableCell>john@example.com</TableCell>
      <TableCell>Admin</TableCell>
    </TableRow>
  </TableBody>
</Table>;
```

---

### EmptyState

A component for displaying empty states with icon, title, description, and action.

**Props:**

- `icon?: ReactNode` - Icon to display
- `title: string` - Main message (required)
- `description?: string` - Additional context
- `action?: ReactNode` - Action button or element
- All standard HTML div attributes

**Usage:**

```tsx
import { EmptyState, Button } from "@/components/ui";

<EmptyState
  icon={<InboxIcon />}
  title="No items found"
  description="Get started by creating your first item"
  action={<Button>Create Item</Button>}
/>;
```

---

### ConfirmDialog

A modal confirmation dialog with elegant backdrop blur for destructive or important actions.

**Props:**

- `isOpen: boolean` - Controls dialog visibility (required)
- `onClose: () => void` - Called when dialog should close (required)
- `onConfirm: () => void` - Called when user confirms action (required)
- `title: string` - Dialog title (required)
- `description?: string` - Additional context text
- `confirmText?: string` - Confirm button text (default: "Confirm")
- `cancelText?: string` - Cancel button text (default: "Cancel")
- `variant?: "warning" | "error"` - Visual style (default: "warning")
- `isLoading?: boolean` - Shows loading state (default: false)
- `icon?: ReactNode` - Custom icon (uses default warning icon if not provided)

**Features:**

- **Elegant backdrop blur** - Subtle background blur instead of dark overlay
- **Smooth animations** - Fade and scale transitions
- **Focus management** - Traps focus within the dialog
- **Mobile responsive** - Works on all screen sizes

**Usage:**

```tsx
import { ConfirmDialog } from "@/components/ui";

const [showConfirm, setShowConfirm] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem();
    setShowConfirm(false);
  } catch (error) {
    // Handle error
  } finally {
    setIsDeleting(false);
  }
};

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Item"
  description="Are you sure you want to delete this item? This action cannot be undone."
  confirmText="Delete"
  cancelText="Cancel"
  variant="error"
  isLoading={isDeleting}
/>;
```

**Use Cases:**

- Confirming destructive actions (delete, logout)
- Important decisions requiring user confirmation
- Actions that cannot be undone
- Critical operations that need explicit consent

---

## Utilities

### cn() Function

The `cn()` utility function combines `clsx` and `tailwind-merge` to merge class names intelligently.

**Location:** `lib/utils.ts`

**Usage:**

```tsx
import { cn } from "@/lib/utils";

const className = cn(
  "base-class",
  condition && "conditional-class",
  {
    "object-conditional": isActive,
    "another-class": isEnabled,
  },
  props.className // Allow component consumers to add classes
);
```

**Why use cn()?**

- Handles conditional classes elegantly
- Resolves Tailwind CSS class conflicts (e.g., `px-4` vs `px-2`)
- Type-safe with TypeScript
- Accepts arrays, objects, and strings

---

## Best Practices

### 1. Component Composition

Prefer composing components over creating monolithic ones:

```tsx
// Good ✓
<Card>
  <CardContent>
    <Label htmlFor="name">Name</Label>
    <Input id="name" />
  </CardContent>
</Card>

// Avoid ✗
<CustomFormCard label="Name" inputId="name" />
```

### 2. Semantic HTML

Always use proper HTML semantics:

```tsx
// Good ✓
<form onSubmit={handleSubmit}>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" />
  <Button type="submit">Submit</Button>
</form>

// Avoid ✗
<div onClick={handleSubmit}>
  <div>Email</div>
  <Input />
  <div onClick={submit}>Submit</div>
</div>
```

### 3. Accessibility

- Always use labels with form inputs
- Provide meaningful alt text for icons
- Ensure proper keyboard navigation
- Use semantic HTML elements

```tsx
// Good ✓
<Label htmlFor="password">Password</Label>
<Input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<span id="password-hint">Must be at least 8 characters</span>
```

### 4. Type Safety

Always provide proper types for component props:

```tsx
// Good ✓
interface FormData {
  email: string;
  password: string;
}

const [formData, setFormData] = useState<FormData>({
  email: "",
  password: "",
});

// Avoid ✗
const [formData, setFormData] = useState({
  email: "",
  password: "",
});
```

### 5. Error Handling

Always handle errors gracefully and provide user feedback:

```tsx
try {
  await submitForm(data);
  toast.success("Form submitted!");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  toast.error(message);
}
```

### 6. Consistent Styling

Use the UI components for consistency rather than inline styles:

```tsx
// Good ✓
<Button variant="primary" size="lg">
  Submit
</Button>

// Avoid ✗
<button className="bg-blue-500 px-8 py-4 ...">
  Submit
</button>
```

### 7. Extending Components

When you need custom styling, use the `className` prop:

```tsx
<Button className="mt-4 w-full">Custom Styled Button</Button>

// For complex customization, consider creating a new variant
```

---

## Extending the Library

To add a new component:

1. Create the component file in `components/ui/`
2. Follow the existing patterns (forwardRef, props interface, cn for classes)
3. Export from `components/ui/index.ts`
4. Document usage in this README

**Example:**

```tsx
// components/ui/Badge.tsx
import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger";
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    // Implementation
  }
);

Badge.displayName = "Badge";
export default Badge;
```

---

## Design Principles

1. **Composability** - Components should work well together
2. **Accessibility** - WCAG 2.1 AA compliance where possible
3. **Flexibility** - Allow customization via props and className
4. **Type Safety** - Full TypeScript support
5. **Consistency** - Unified design language
6. **Performance** - Optimized for React rendering
7. **Developer Experience** - Easy to use with great intellisense

---

## Credits

This UI library is inspired by:

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Headless UI](https://headlessui.com/)

Built with ❤️ for the MikroTik Reset System.
