# ZapTron - AI Follow-Up Simulation (TypeScript)

This is a simulated AI follow-up system for evaluating leads and sending human-like messages using OpenAI.
## Overview
The ZapTron project is a TypeScript-based lead follow-up system that uses Express.js for routing and OpenAI's GPT model for generating human-like responses. The application follows a clear flow: leads are stored in memory, checked periodically using isTimeToFollowUp(), and when it's time, the system generates personalized follow-up messages using OpenAI. The system includes function calling capabilities to update lead statuses (booked/stopped) and implements retry logic for API calls. The codebase utilizes TypeScript interfaces for type safety, environment variables for configuration, and Express middleware for error handling.
## How to Run

1. Clone the repo or unzip folder.
2. Run `npm install`
3. Add your OpenAI API key in `.env`
4. Run dev server: `npx ts-node src/server.ts` or compile + run: `tsc && node dist/server.js`

## Endpoints

- `GET /send` - Check for leads to follow-up
- `GET /reply` - Endpoint to simulate a reply from the lead
