# Social Media Posting Engine - React + TypeScript

This project is a **React + TypeScript** migration of the vanilla JavaScript Social Media Posting Engine. It provides a multi-step workflow for creating, customizing, and publishing social media posts across multiple platforms.

## Features

✨ **Multi-Step Workflow**

- Step 1: Base Post Creation - Enter title, content, language, and tone
- Step 2: Visual Selection - Upload images or select from media library with AI editing
- Step 3: Channel Selection - Choose target social media platforms
- Step 4: Review & Preview - Preview posts in mobile/desktop mode for each platform
- Step 5: Publish - Final review and publish (mocked)

🎨 **Platform Previews**

- Facebook, Instagram, X (Twitter), TikTok, Snapchat

🤖 **AI Features**

- AI-powered content generation per platform
- AI image editing (mocked)
- Platform-specific content optimization

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Font Awesome** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Build for Genexus UC

```bash
npm run watch-build
```

## Project Structure

```
src/
├── components/
│   ├── Steps/              # Step components
│   ├── Stepper/            # Progress stepper
│   ├── ExampleChips/       # Example content chips
│   └── PlatformPreview/    # Platform previews
├── hooks/
│   └── usePostingEngine.ts # Main state hook
├── data/
│   └── channels.ts         # Platform configs
├── types/
│   └── index.ts            # TypeScript types
├── utils/
│   └── textGeneration.ts   # Content generation
└── App.tsx                 # Main component
```

## Migration from Vanilla JS

This project was migrated from vanilla JavaScript with:

- ✅ Component-based architecture
- ✅ Type safety with TypeScript
- ✅ Modern React hooks
- ✅ Better state management
- ✅ Improved developer experience

## Configuration

Edit `vite.config.ts` to set the Genexus app folder path for UC builds.

## License

Proprietary - Grippi
