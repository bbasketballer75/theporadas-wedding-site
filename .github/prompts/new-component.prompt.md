---
mode: 'agent'
tools: ['codebase', 'editFiles']
description: 'Generate a new React component for The Poradas Wedding Site'
---

# Generate New React Component

Your goal is to generate a new React component for The Poradas Wedding Site.

## Instructions

1. Ask for the component name if not provided
2. Ask for component props/functionality if not provided
3. Search the codebase for similar components as reference
4. Generate the component following project standards

## Requirements

### TypeScript

- Use TypeScript (.tsx file) if component has complex logic
- Define TypeScript interface for props
- Use explicit return types for functions

### React Patterns

- Use functional component with hooks
- Use arrow function syntax
- Lazy load heavy dependencies

### Styling

- Use Tailwind CSS utility classes only
- Use wedding theme colors: sage, blush, mint, cream
- Use font-display for headings, font-body for text
- Ensure responsive design (mobile-first)

### Component Template

```tsx
import { useState, useEffect } from 'react';

interface ComponentNameProps {
  prop1: string;
  prop2?: number;
}

export default function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-6">
      <h2 className="font-display text-3xl text-sage mb-4">{prop1}</h2>
      <p className="font-body text-lg text-gray-700">Content</p>
    </div>
  );
}
```

## Actions

1. **Search** for similar components: `#codebase site/components/`
2. **Create** the component file in `site/components/`
3. **Add** JSDoc comments for documentation
4. **Export** as default
5. **Suggest** where to import the component

## Example Usage

User: "Create a GuestCard component to display guest info with name, photo, and message"

Agent:

1. Search for similar card components
2. Create `site/components/GuestCard.tsx`
3. Define props interface
4. Implement component with wedding theme
5. Suggest importing in gallery page
