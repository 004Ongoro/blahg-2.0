# Blahg 2.0

Blahg 2.0 is a production-grade, open-source blog platform built with **Next.js 15+**, **TypeScript**, and **MongoDB**. It is designed for developers who want a modern, high-performance site featuring a modular architecture, clean UI components (powered by Radix UI), and integrated newsletter capabilities.

## Features

-   **Modern Tech Stack**: Built with Next.js App Router, React 19, and TypeScript.
-   **Clean UI/UX**: Responsive design using Tailwind CSS 4.0 and accessible components from Radix UI.
-   **Markdown Content**: Full support for writing posts in Markdown with syntax highlighting via `rehype-highlight`.
-   **Newsletter Integration**: Built-in subscription system using Resend and MongoDB.
-   **Email Webhooks**: Integrated Resend webhooks for tracking email events (delivered, opened, bounced, etc.) with an admin view.
-   **RSS Feed**: Automatically generated RSS feed at `/rss.xml` for content syndication.
-   **Dynamic SEO**: Automated Open Graph (OG) image generation and metadata management for optimized social sharing.
-   **Interactive Comments**: Integrated Giscus support for GitHub-powered discussions.
-   **Analytics**: Native support for Vercel Analytics and Google Analytics.

##  Setup Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/004Ongoro/blahg-2.0.git](https://github.com/004Ongoro/blahg-2.0.git)
cd blahg-2.0
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory by copying the provided example:
```bash
cp .env.example .env
```
Update the values in `.env` with your specific credentials:
- **MONGODB_URI**: Your MongoDB connection string.
- **JWT_SECRET**: A secure key for user authentication.
- **GMAIL_APP_PASSWORD / USER**: Credentials for transactional emails.
- **RESEND_API_KEY**: API key for newsletter distribution.
- **RESEND_WEBHOOK_SECRET**: Signing secret for verifying Resend webhooks.
- **GOOGLE_ANALYTICS_ID**: Your tracking ID - You can gt this from Google analytics(e.g., `G-XXXXXXXXXX`).

### 4. Customize Analytics
The project includes a global Google Analytics script. After setting your `GOOGLE_ANALYTICS_ID` in the `.env` file, ensure you update the measurement ID in the root layout to match your own property.

**File to modify:** `app/layout.tsx`

### 5. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

##  Environment Variables Example (`.env.example`)

```env
# Database
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority"

# Security
JWT_SECRET="your_jwt_secret_key"

# Email Services
GMAIL_APP_PASSWORD="your_gmail_app_password"
GMAIL_USER="your_gmail_user@gmail.com"
RESEND_API_KEY="your_resend_api_key"
RESEND_WEBHOOK_SECRET="your_resend_webhook_secret"

# Analytics
GOOGLE_ANALYTICS_ID="your_google_analytics_id"
```

##  Contribution Guidelines

I welcome community contributions!
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

---
Built by [George Ongoro](https://dev.ongoro.top).
