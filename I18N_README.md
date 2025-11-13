# Internationalization (i18n) Setup

This application supports multiple languages using `next-intl`. Currently supported languages:
- 🇮🇹 Italian (it) - Default
- 🇬🇧 English (en)

## How It Works

### URL Structure
The application uses locale-based routing:
- `/` or `/it` - Italian (default)
- `/en` - English

The middleware automatically handles locale detection and routing.

### File Structure

```
src/
├── i18n/
│   ├── request.ts      # i18n configuration
│   └── routing.ts      # Routing configuration and navigation helpers
├── app/
│   └── [locale]/       # All localized routes go here
│       ├── layout.tsx  # Locale-aware layout
│       ├── page.tsx    # Home page
│       ├── dashboard/  # Dashboard routes
│       ├── admin/      # Admin routes
│       └── ...
└── middleware.ts       # Handles locale routing and auth

messages/
├── it.json            # Italian translations
└── en.json            # English translations
```

## Using Translations

### In Server Components (Async)

For async server components, use `getTranslations`:

```tsx
import { getTranslations } from 'next-intl/server';

export default async function MyComponent() {
  const t = await getTranslations('dashboard');
  
  return <h1>{t('welcome')}</h1>;
}
```

### In Client Components

For client components, use `useTranslations` hook:

```tsx
'use client';

import { useTranslations } from 'next-intl';

export function MyClientComponent() {
  const t = useTranslations('common');
  
  return <button>{t('save')}</button>;
}
```

**Important:** Always add `'use client'` directive at the top of files that use the `useTranslations` hook!

### With Parameters

```tsx
const t = useTranslations('dashboard');

// In translation file: "daysRemaining": "{days} giorni rimanenti"
<span>{t('daysRemaining', { days: 7 })}</span>
```

## Navigation

### Using the Link Component

Always use the internationalized Link component:

```tsx
import { Link } from '@/i18n/routing';

<Link href="/dashboard">Dashboard</Link>
```

This automatically handles locale prefixes.

### Programmatic Navigation

```tsx
'use client';

import { useRouter } from '@/i18n/routing';

export function MyComponent() {
  const router = useRouter();
  
  const navigate = () => {
    router.push('/dashboard');
  };
  
  return <button onClick={navigate}>Go to Dashboard</button>;
}
```

## Adding New Translations

### 1. Add to Translation Files

Edit `messages/it.json`:
```json
{
  "myFeature": {
    "title": "Il mio titolo",
    "description": "La mia descrizione"
  }
}
```

Edit `messages/en.json`:
```json
{
  "myFeature": {
    "title": "My title",
    "description": "My description"
  }
}
```

### 2. Use in Components

```tsx
const t = useTranslations('myFeature');

<h1>{t('title')}</h1>
<p>{t('description')}</p>
```

## Language Switcher

The language switcher is available in:
- Desktop header (top navigation)
- Sidebar footer (admin panel)

Users can switch between languages, and the current page will be maintained in the new locale.

## Adding a New Language

1. Add the locale code to `src/i18n/routing.ts`:
```tsx
export const routing = defineRouting({
  locales: ['it', 'en', 'es'], // Add 'es' for Spanish
  defaultLocale: 'it',
});
```

2. Create a new translation file: `messages/es.json`

3. Update the language switcher in `src/components/common/language-switcher.tsx`:
```tsx
const languages = [
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }, // Add this
];
```

## Protected Routes

The middleware handles both authentication and localization. Protected routes (like `/dashboard` and `/admin`) work with locale prefixes:
- `/it/dashboard` (Italian)
- `/en/dashboard` (English)

## Best Practices

1. **Always use translation keys**: Avoid hardcoded strings in components
2. **Use the internationalized navigation**: Always import Link and useRouter from `@/i18n/routing`
3. **Organize translations**: Group related translations under meaningful namespaces
4. **Keep translations in sync**: When adding a key to one language, add it to all others
5. **Use parameters for dynamic content**: `t('greeting', { name: 'John' })`

## TypeScript Support

For type-safe translations, you can create a type definition file:

```typescript
// src/types/translations.ts
import type it from '../../messages/it.json';

type Messages = typeof it;

declare global {
  interface IntlMessages extends Messages {}
}
```

This provides autocomplete and type checking for translation keys.

## Troubleshooting

### Translations not appearing
1. Check that the key exists in the translation file
2. Verify you're using the correct namespace: `useTranslations('namespace')`
3. Ensure the locale is properly set in the URL

### Links not working
1. Make sure you're using `Link` from `@/i18n/routing`, not from `next/link`
2. Check that the middleware matcher includes your route

### Locale not changing
1. Clear browser cache
2. Check browser console for errors
3. Verify the middleware configuration

