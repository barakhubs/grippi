# Styles Directory

This directory contains all CSS styles for the Social Media Posting Engine application.

## File Structure

```
src/styles/
├── index.css              # Main entry point (imports all styles)
├── posting-engine.css     # Complete styles from vanilla JS migration
└── README.md             # This file
```

## Usage

### In Components

Import the main stylesheet in your root component:

```typescript
// In App.tsx or main.tsx
import "./styles/posting-engine.css";
```

Or use the index file for future extensibility:

```typescript
import "./styles/index.css";
```

## Style Organization

The `posting-engine.css` file contains all styles organized in the following sections:

### 1. CSS Variables & Theming

- Color palette
- Typography
- Spacing & layout variables
- Border radius, shadows

### 2. Base Styles

- Global resets
- Root element styles
- Body and layout containers

### 3. Layout Components

- `.ucpe_layout` - Main container
- `.ucpe_panel` - Content panels
- `.ucpe_stepper-nav` - Step navigation
- `.ucpe_nav-panel` - Navigation wrapper

### 4. Form Elements

- `.ucpe_form-grid` - Form layout
- `.ucpe_field` - Form field container
- Input, select, textarea styles
- Custom checkbox/radio button styles
- `.ucpe_example-chips` - Example content selectors

### 5. Image Gallery

- `.ucpe_gallery` - Image grid
- `.ucpe_image-card` - Individual image cards
- `.ucpe_image-card-actions` - Hover actions
- `.ucpe_edit-ai-btn` - AI edit button
- `.ucpe_badge` - Image type badges

### 6. Channel Selection

- `.ucpe_channels` - Channel grid
- `.ucpe_channel-card` - Channel cards
- `.ucpe_channel-checkbox` - Selection inputs

### 7. Platform Previews

- `.ucpe_preview-container` - Preview wrapper
- `.ucpe_phone-frame` - Mobile device frame
- `.ucpe_desktop-frame` - Desktop browser frame
- `.ucpe_platform-post` - Platform-specific containers

### 8. Social Media Platforms

Each platform has dedicated styles:

- **Facebook**: `.ucpe_fb-post`, `.ucpe_fb-post-header`, etc.
- **Instagram**: `.ucpe_ig-post`, `.ucpe_ig-avatar`, etc.
- **X (Twitter)**: `.ucpe_twitter-post`, `.ucpe_twitter-avatar`, etc.
- **TikTok**: `.ucpe_tiktok-post`, `.ucpe_tiktok-content`
- **Snapchat**: `.ucpe_snap-post`, `.ucpe_snap-text-overlay`

### 9. Modals

- `.ucpe_modal-overlay` - Modal backdrop
- `.ucpe_modal-content` - Modal container
- `.ucpe_modal-large` - Large modal variant
- `.ucpe_modal-fullscreen` - Fullscreen modal
- `.ucpe_media-library-grid` - Media library
- `.ucpe_ai-editor-grid` - AI editor layout

### 10. Buttons & Actions

- `.ucpe_btn-primary` - Primary CTA
- `.ucpe_btn-secondary` - Secondary actions
- `.ucpe_btn-outline` - Outlined buttons
- `.ucpe_btn-ghost` - Ghost buttons
- `.ucpe_btn-soft` - Soft background buttons
- `.ucpe_step-nav` - Step navigation buttons

### 11. Utility Classes

- `.ucpe_eyebrow` - Small uppercase labels
- `.ucpe_error-message` - Error displays
- `.ucpe_status-pill` - Status badges
- `.ucpe_view-toggles` - Preview mode toggles

### 12. Responsive Design

Media queries for:

- `@media (max-width: 1200px)` - Large tablets
- `@media (max-width: 900px)` - Tablets
- `@media (max-width: 768px)` - Small tablets
- `@media (max-width: 600px)` - Mobile

### 13. Animations

- `@keyframes fadeIn` - Fade in effect
- `@keyframes slideUp` - Slide up effect
- `@keyframes slideDown` - Slide down effect
- `@keyframes spin` - Rotation animation

## Naming Convention

All classes use the `ucpe_` prefix (Posting Engine) to avoid conflicts with other styles.

Examples:

- `ucpe_layout` - Layout components
- `ucpe_btn-primary` - Button variants
- `ucpe_modal-overlay` - Modal elements
- `ucpe_fb-post` - Platform-specific (Facebook)

## CSS Variables

Theme customization via CSS custom properties:

```css
:root {
  --bg: #f7f8fb; /* Background color */
  --surface: #ffffff; /* Card/panel background */
  --border: #b9bfcf; /* Border color */
  --muted: #667085; /* Muted text */
  --text: #111322; /* Primary text */
  --accent: #000000; /* Primary accent (black) */
  --accent-2: #ffff01; /* Secondary accent (yellow) */
  --success: #16a34a; /* Success/approval */
  --danger: #e11d48; /* Error/danger */
  --shadow: 0 10px 35px rgba(18, 38, 63, 0.12); /* Drop shadow */
  --radius: 14px; /* Border radius */
  --font-base: "Segoe UI", "Bahnschrift", "Trebuchet MS", sans-serif;
}
```

## Migration Notes

These styles were migrated from the vanilla JavaScript version located in:
`d:\grippi\backup\styles.css`

All 1590 lines of CSS have been preserved with only minimal React-specific additions:

- Added `body` and `#root` styles for React mount point
- Maintained all class names and structure
- Preserved all responsive breakpoints
- Kept all animations and transitions

## Future Enhancements

Potential improvements for the styles:

1. **CSS Modules** - Convert to scoped CSS modules for better encapsulation
2. **Sass/Less** - Use preprocessor for variables and mixins
3. **Theme Variants** - Add dark mode support
4. **Component-Specific Files** - Split into smaller, component-based files
5. **CSS-in-JS** - Consider styled-components or emotion for dynamic styling

## Browser Support

Styles use modern CSS features:

- CSS Custom Properties (CSS Variables)
- CSS Grid
- Flexbox
- CSS Animations
- Backdrop Filter (for modal blur effect)

Minimum browser versions:

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance

The complete stylesheet is ~50KB uncompressed. Production build with Vite will:

- Minify CSS
- Remove unused styles (tree-shaking)
- Generate optimized chunks
- Add vendor prefixes via PostCSS

## Maintenance

When updating styles:

1. Test across all supported browsers
2. Verify responsive behavior at all breakpoints
3. Check dark mode compatibility (if implemented)
4. Ensure accessibility (focus states, contrast ratios)
5. Update this README if adding new sections
