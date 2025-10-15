# Alert Component Usage Guide

A professional, reusable alert component with multiple variants, dismissibility, auto-close functionality, and responsive design.

## Features

✅ **Multiple Variants**: `success`, `error`, `warning`, `info`  
✅ **Dismissible**: Optional close button  
✅ **Auto-close**: Automatically dismiss after a specified time  
✅ **Progress Bar**: Visual countdown for auto-close  
✅ **Responsive**: Mobile-friendly with adaptive sizing  
✅ **Accessible**: Proper ARIA attributes and keyboard support  
✅ **Animated**: Smooth fade-in/fade-out transitions  
✅ **Customizable**: Custom icons, titles, and styling

## Basic Usage

### Simple Alert

```tsx
import { Alert } from "@/components/ui";

<Alert variant="info">This is a basic informational alert</Alert>;
```

### Alert with Title

```tsx
<Alert variant="success" title="Success!">
  Your router has been added successfully
</Alert>
```

## Variants

### Success Alert

```tsx
<Alert variant="success" title="Operation Completed">
  The user has been reset successfully
</Alert>
```

### Error Alert

```tsx
<Alert variant="error" title="Connection Failed">
  Unable to connect to the MikroTik router. Please check your credentials.
</Alert>
```

### Warning Alert

```tsx
<Alert variant="warning" title="Please Note">
  This action will remove all active connections for the user
</Alert>
```

### Info Alert

```tsx
<Alert variant="info" title="Information">
  The router API uses port 8728 by default
</Alert>
```

## Advanced Features

### Dismissible Alert

```tsx
<Alert
  variant="warning"
  dismissible
  onDismiss={() => console.log("Alert dismissed")}
>
  You can close this alert by clicking the X button
</Alert>
```

### Auto-Close Alert

```tsx
// Auto-close after 5 seconds with progress bar
<Alert variant="success" autoClose={5000} showProgress={true}>
  This alert will close automatically in 5 seconds
</Alert>
```

### Auto-Close + Dismissible

```tsx
<Alert
  variant="info"
  dismissible
  autoClose={10000}
  onDismiss={() => console.log("Closed")}
>
  This alert auto-closes in 10 seconds, or you can dismiss it manually
</Alert>
```

### Custom Icon

```tsx
<Alert
  variant="info"
  icon={
    <svg
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  }
>
  Alert with a custom lightning bolt icon
</Alert>
```

## Real-World Examples

### Form Validation Error

```tsx
const [error, setError] = useState<string | null>(null);

{
  error && (
    <Alert
      variant="error"
      title="Validation Error"
      dismissible
      onDismiss={() => setError(null)}
    >
      {error}
    </Alert>
  );
}
```

### Success Notification with Auto-Close

```tsx
const [showSuccess, setShowSuccess] = useState(false);

const handleSubmit = async () => {
  // ... submit logic
  setShowSuccess(true);
};

{
  showSuccess && (
    <Alert
      variant="success"
      title="Router Added!"
      autoClose={3000}
      onDismiss={() => setShowSuccess(false)}
    >
      Your router configuration has been saved successfully.
    </Alert>
  );
}
```

### Complex Alert with Rich Content

```tsx
<Alert variant="warning" title="Multiple Operations" dismissible>
  <div className="space-y-2">
    <p className="text-sm">The following actions will be performed:</p>
    <ul className="text-sm list-disc list-inside space-y-1">
      <li>Remove active connections</li>
      <li>Clear hotspot cookies</li>
      <li>Remove MAC bindings</li>
    </ul>
  </div>
</Alert>
```

### Loading State Alert

```tsx
<Alert variant="info" title="Processing...">
  <div className="flex items-center gap-2">
    <Spinner size="sm" />
    <span>Connecting to router...</span>
  </div>
</Alert>
```

## Props API

| Prop           | Type                                          | Default      | Description                              |
| -------------- | --------------------------------------------- | ------------ | ---------------------------------------- |
| `variant`      | `"success" \| "error" \| "warning" \| "info"` | `"info"`     | Alert style variant                      |
| `title`        | `string`                                      | `undefined`  | Optional title text                      |
| `icon`         | `ReactNode`                                   | Default icon | Custom icon element                      |
| `dismissible`  | `boolean`                                     | `false`      | Show close button                        |
| `onDismiss`    | `() => void`                                  | `undefined`  | Callback when dismissed                  |
| `autoClose`    | `number`                                      | `undefined`  | Auto-close delay in milliseconds         |
| `showProgress` | `boolean`                                     | `true`       | Show progress bar (requires `autoClose`) |
| `className`    | `string`                                      | `undefined`  | Additional CSS classes                   |

## Responsive Behavior

The Alert component is fully responsive:

- **Mobile (< 640px)**: Smaller icons (h-5 w-5), compact padding (p-3)
- **Desktop (≥ 640px)**: Larger icons (h-6 w-6), comfortable padding (p-4)
- **Text**: Scales from text-sm to text-base on larger screens

## Accessibility

The component includes:

- `role="alert"` for screen readers
- `aria-live="polite"` for dynamic updates
- `aria-label` on dismiss button
- `aria-hidden="true"` on decorative icons
- Keyboard navigable close button
- Focus ring indicators

## Color System Alignment

The Alert uses your project's existing color palette:

- **Success**: Green (`green-50`, `green-200`, `green-600`, `green-800`)
- **Error**: Red (`red-50`, `red-200`, `red-600`, `red-800`)
- **Warning**: Amber (`amber-50`, `amber-200`, `amber-600`, `amber-800`)
- **Info**: Blue (`blue-50`, `blue-200`, `blue-600`, `blue-800`)

## Best Practices

1. **Use appropriate variants**: Match the alert type to the message severity
2. **Keep messages concise**: Alerts should be scannable and easy to understand
3. **Use dismissible wisely**: For persistent information, don't make it dismissible
4. **Auto-close for success**: Success messages often work well with 3-5 second auto-close
5. **Keep errors dismissible**: Give users control over error message visibility
6. **Combine features**: Use both `dismissible` and `autoClose` for flexibility

## Common Patterns

### Toast Alternative

Use with absolute positioning for toast-like notifications:

```tsx
<div className="fixed top-4 right-4 z-50 max-w-md">
  <Alert variant="success" dismissible autoClose={4000}>
    Changes saved successfully!
  </Alert>
</div>
```

### Inline Form Feedback

```tsx
<form>
  {/* form fields */}

  {error && (
    <Alert variant="error" dismissible>
      {error}
    </Alert>
  )}

  <Button type="submit">Submit</Button>
</form>
```

### Conditional Rendering

```tsx
{
  routers.length === 0 && (
    <Alert variant="warning">
      Please add a router first before resetting users
    </Alert>
  );
}
```

## Notes

- The component uses `"use client"` directive (required for state management)
- Auto-close timer automatically cleans up on unmount
- Dismissal includes smooth animation (300ms fade-out)
- Progress bar updates every 50ms for smooth animation
