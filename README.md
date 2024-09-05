# Live transcription PoC

This is a Next.js application that provides live transcription and translation services using Deepgram and Groq models. The app captures audio input from the user's microphone, transcribes it in real-time, and transforms the transcribed text based on a custom prompt. The goal of this app is to experiment with Deepgram transcriptions and evaluate speed of Groq API.
The app is heavily based on the [Next.js Live Transcription App](https://github.com/deepgram-starters/nextjs-live-transcription) by [Deepgram DX Team](https://developers.deepgram.com/).

## Features

- **Live Transcription**: Uses Deepgram's API to transcribe audio in real-time.
- **Custom Prompts**: Allows users to input custom prompts for text processing.
- **Model Selection**: Users can select different models for both transcription and text generation.
- **Response Time**: Displays the response time for text generation.

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Install dependencies:

   ```sh
   npm install
   # or
   yarn install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add your API keys:
   ```env
   DEEPGRAM_API_KEY=your_deepgram_api_key
   GROQ_API_KEY=your_groq_api_key
   DEEPGRAM_ENV=development
   ```

### Running the App

1. Start the development server:

   ```sh
   npm run dev
   # or
   yarn dev
   ```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

- **Microphone Setup**: Ensure your microphone is set up and allowed in the browser.
- **Transcription**: Start speaking, and the app will transcribe your speech in real-time.
- **Custom Prompt**: Enter a custom prompt to process the transcribed text.
- **Model Selection**: Choose the desired models for transcription and text generation from the dropdown menus.

## Project Structure

- `app/api/authenticate/route.ts`: Handles authentication and API key management with Deepgram.
- `app/api/completion/route.ts`: Manages text generation using Groq models.
- `app/components/App.tsx`: Main React component for the application.
- `package.json`: Lists project dependencies and scripts.

## Dependencies

- `@deepgram/sdk`: Deepgram SDK for transcription.
- `@ai-sdk/openai`: SDK for interacting with Groq models.
- `next`: Next.js framework.
- `react`: React library.
- `tailwindcss`: Utility-first CSS framework.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.
