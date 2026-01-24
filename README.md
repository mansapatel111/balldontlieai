


Ball Don't Lie
Files
Commands
Packager files
Config files
/
This app is in Design Mode which is best for rapid designs & websites. 

Integrations
Replit managed
These are built-in integrations that work automatically. Create an app and your agent can start using these right away.
Name
Type
Replit Database
PostgreSQL	
Replit App Storage
Object Storage	
Replit Auth
Authentication	
Replit Domains
Domains	
Connectors
These are first-party integrations Replit supports. Sign in once and build with them across your apps.
Name
Description
Connection Status

GitHub
GitHub
Access GitHub repositories, users, and organizations from your Replit apps	
Active

AgentMail
AgentMail
Send, receive, and reply to emails using the AgentMail email inbox API.	

Asana
Asana
Read tasks and project data from Asana workspaces	

Box
Box
Access Box files and folders from Replit	

Confluence
Confluence
Read users and groups, create and edit content in Confluence spaces	

Discord
Discord
Access Discord guild information and user profiles	

Dropbox
Dropbox
Access Dropbox files, content, and metadata	

Gmail
Gmail
Send, receive, and manage Gmail messages	

Google Calendar
Google Calendar
Read and write Google Calendar events and settings	

Google Docs
Google Docs
Create, read, and edit Google Docs	

Google Drive
Google Drive
Access and manage Google Drive files and folders	

Google Sheets
Google Sheets
Read and write data in Google Sheets	

HubSpot
HubSpot
Access HubSpot CRM objects, contacts, and deals from Replit	

Jira
Jira
View users and manage Jira work items and issues	

Linear
Linear
Create and manage Linear issues, comments, and schedules	

Notion
Notion
Read and write to Notion workspaces and pages	

OneDrive
OneDrive
Access and manage OneDrive files and folders	

Outlook
Outlook
Send and receive emails, manage Outlook calendar events	

Resend
Resend
Send transactional emails using the Resend API	

SendGrid
SendGrid
Send transactional emails using the SendGrid API	

SharePoint
SharePoint
Read, write, and manage SharePoint sites and documents	

Spotify
Spotify
Access and manage Spotify playlists and libraries	

Todoist
Todoist
Read and write to your Todoist tasks and projects	

Twilio
Twilio
Send SMS messages and make voice calls using the Twilio API	

Zendesk
Zendesk
Access Zendesk users and support tickets from Replit	
MCP Servers for Replit Agent
Beta
Provide external context and tools to Replit Agent by connecting to MCP servers.
Name
Description
Connection Status

Figma MCP
Figma MCP
Allow Replit Agent to view and rapidly build your designs from Figma	
Help us expand MCP support
Tell us which MCP servers would be most useful for your workflows. Your feedback will help shape what we build next.
Git Providers
Connect your git provider to push, pull, and sync code via the Git pane. Not accessible to Replit Agent.
Name
Description
Connection Status

GitHub
GitHub
Sync code to GitHub repositories from your Replit apps	
Active

Bitbucket
Bitbucket
Sync code to Bitbucket repositories from your Replit apps	

GitLab
GitLab
Sync code to GitLab projects from your Replit apps	
Developer Tools
Access debugging tools, monitor resources, and manage your development environment
Dependencies
SSH
Remote Updates
origin/main•upstream
last fetched 2 hours ago
Commit
Message
⌘
↵
Review Changes
1 change
1 changed file
README.md
A
Committing will automatically stage your changes.

Ball Don't Lie - Brainrot Sports Commentator
"Ball Don't Lie" is a React application that transforms ordinary sports clips into humorous, meme-filled commentary. Select your personality, choose a voice, and let the AI roast the gameplay.

Features
Upload & Preview: Upload your own gameplay clips.
Personality Selector: Choose from different "vibes" (Ruthless, Hype, Analytical, Savage).
Voice Selector: Pick the perfect AI voice narrator (Adam, Charlie, Bella, Drake).
Immersive UI: Cybernetic grid background with interactive shader effects.
Commentary Showcase: "Hall of Flame" featuring top community roasts.
Tech Stack
Frontend: React 18, TypeScript, Vite
Styling: Tailwind CSS v4, Framer Motion
UI Components: Shadcn UI, Lucide Icons
3D/Graphics: Three.js (for the interactive grid background)
Audio: use-sound for interactive UI sound effects
Getting Started
Follow these steps to run the project locally on your machine.

Prerequisites
Node.js (Version 18 or higher recommended)
npm (usually installed with Node.js)
Installation
Clone the repository (if you downloaded as zip, extract it):

git clone <your-repo-url>
cd ball-dont-lie
Install dependencies:

npm install
Running the Application
To start the development server:

npm run dev:client
This will launch the application at http://localhost:5000 (or another available port).

Building for Production
To create a production-ready build:

npm run build
This generates the static files in the dist directory.

Project Structure
client/src: Main React application code
components: Reusable UI components (VibeSelector, VoiceSelector, etc.)
pages: Application pages (Home, Studio)
lib: Utility functions and constants
client/public: Static assets (images, sounds)
License
MIT
