# 💬 AI-Powered Chat Interface

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A modern, responsive chat interface powered by Langflow, built with React, TypeScript, and Tailwind CSS. This application provides a seamless AI conversation experience with a clean, intuitive UI and smooth animations.

## ✨ Features

- **AI-Powered Chat** - Integrated with Langflow for intelligent conversations
- **Modern UI/UX** - Built with Shadcn/UI and Tailwind CSS
- **Session Management** - Maintains conversation context with session IDs
- **Responsive Design** - Works on desktop and mobile devices
- **Type Safety** - Full TypeScript support
- **Netlify Functions** - Serverless backend for Langflow API integration
- **Multi-language Support** - Built with internationalization (i18n) in mind

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Shadcn/UI
- **State Management**: React Query
- **Animations**: Framer Motion
- **Routing**: React Router v6
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or later
- npm 7.0 or later
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chat-interface.git
   cd chat-interface
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Required for Langflow integration
   VITE_LANGFLOW_BASE_URL=your_langflow_base_url
   VITE_FLOW_ID=your_flow_id
   VITE_LANGFLOW_API_KEY=your_api_key
   
   # Optional: For Hugging Face integration
   VITE_HF_TOKEN=your_huggingface_token
   
   # Development server
   PORT=3000
   ```
   
   Note: For security reasons, never commit your `.env` file to version control. Add it to your `.gitignore` file.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   ```

## 🎨 Project Structure

```
src/
├── components/            # Reusable UI components
│   ├── ui/                # Shadcn/UI components
│   ├── ChatInterface.tsx  # Main chat interface component
│   ├── MessageList.tsx    # Message display component
│   └── Navigation.tsx     # Site navigation
├── hooks/                 # Custom React hooks
│   ├── useLanguage.tsx    # i18n hook
│   └── useMobile.tsx      # Mobile detection hook
├── lib/
│   └── langflow-client.ts # Langflow API client
├── pages/                 # Page components
│   ├── Index.tsx          # Main page
│   ├── About.tsx          # About page
│   ├── Features.tsx       # Features page
│   └── NotFound.tsx       # 404 page
├── types/                 # TypeScript type definitions
└── App.tsx                # Main application component
```

## 🌐 Netlify Functions

The project uses Netlify Functions to securely communicate with the Langflow API:

```
netlify/
└── functions/
    └── langflow-proxy.ts  # Serverless function for Langflow API calls
```

## 🔌 API Integration

The application uses Netlify Functions to securely communicate with the Langflow API. The main API client is located in `src/lib/langflow-client.ts`.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_LANGFLOW_BASE_URL` | Base URL for Langflow API | Yes |
| `VITE_FLOW_ID` | Your Langflow flow ID | Yes |
| `VITE_LANGFLOW_API_KEY` | API key for Langflow | Yes |
| `VITE_HF_TOKEN` | Hugging Face token (if using HF models) | No |
| `PORT` | Development server port | No (default: 3000) |

### API Endpoints

- `/.netlify/functions/langflow-proxy` - Proxy endpoint for Langflow API

## 🐛 Debugging

1. **Development Tools**
   - Use React DevTools for component inspection
   - Check browser console for errors and warnings
   - Monitor network requests in the browser's Network tab
   - Check Netlify Functions logs in the Netlify dashboard

2. **Common Issues**
   - Ensure all required environment variables are set in `.env`
   - Verify Langflow API is accessible and credentials are correct
   - Check CORS configuration if seeing network errors
   - Clear browser cache if UI doesn't update after changes

3. **Netlify Deployment**
   - Set up environment variables in Netlify dashboard
   - Check function logs for server-side errors
   - Verify build settings in `netlify.toml` (if present)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions, feedback, or support, please:
- Open an issue on the [GitHub repository](https://github.com/your-username/chat-interface/issues)
- Ensure to include steps to reproduce any bugs
- Provide details about your environment (browser, OS, etc.)

## 🚀 Deployment

### Netlify
1. Connect your GitHub repository to Netlify
2. Set up the following environment variables in Netlify dashboard:
   - `VITE_LANGFLOW_BASE_URL`
   - `VITE_FLOW_ID`
   - `VITE_LANGFLOW_API_KEY`
   - `VITE_HF_TOKEN` (if using Hugging Face)
