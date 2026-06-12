# 🎓 Corsair CTF — Automated Certificate Generator

An automated, pixel-perfect certificate generation web application. Participants fill out their names in a clean, modern form, and the server generates and delivers a high-resolution, custom-styled PDF certificate instantly.

The PDF generation uses **Puppeteer** (a headless Chrome instance), meaning the final certificate matches the HTML/CSS design exactly—preserving custom gradients, embedded signatures, fonts, and canvas-drawn watermarks.

---

## ✨ Features

- ⚡ **Instant Generation:** Type name, click generate, download instantly.
- 🎨 **Pixel-Perfect Rendering:** Uses Headless Chrome (Puppeteer) to render HTML templates into A4 PDF format.
- 🔒 **Security-Focused:** Inputs are automatically sanitized to prevent HTML/script injection attacks.
- 📱 **Responsive Design:** A sleek, user-friendly form optimized for desktops, tablets, and smartphones.
- ⚙️ **Docker-Ready:** Pre-configured with a `Dockerfile` for seamless cloud deployment.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **PDF Engine:** Puppeteer (Headless Chrome)
- **Frontend:** Vanilla HTML5 / CSS3 / JavaScript

---

## 📁 Project Structure

```text
├── public/
│   ├── index.html           # Participant-facing form UI
│   └── (static assets)      # Stylesheets, logos, images, etc.
├── templates/
│   └── certificate_template.html  # HTML/CSS template of the certificate
├── Dockerfile               # Production container configuration
├── render-build.sh          # Build script for Render Node.js environment
├── server.js                # Express server and Puppeteer PDF generator
├── package.json             # Node dependencies and npm scripts
└── README.md                # Documentation
```

---

## 🚀 Local Development Setup

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18 or newer). Check your version by running:
```bash
node -v
```

### Installation

1. Clone this repository (or download the source):
   ```bash
   git clone https://github.com/INFINITYv69/certification-automation.git
   cd certification-automation
   ```

2. Install the package dependencies:
   ```bash
   npm install
   ```
   *(Note: This downloads a local copy of Chromium for Puppeteer, which takes a moment but only happens once.)*

3. Start the development server:
   ```bash
   npm start
   ```

4. Open **`http://localhost:3000`** in your browser.
   - *Tip: If you're on the same Wi-Fi/local network, others can access it using your local IP (e.g., `http://192.168.1.XX:3000`).*

---

## ☁️ How to Deploy Online (Free Forever)

Because Puppeteer runs a headless Chrome browser, it requires more RAM and system-level libraries than regular static websites. Below are the three best ways to host this app **completely for free forever**.

---

### Option 1: Koyeb (Recommended — No Sleep!)
Koyeb provides a free tier that allows you to run one web service continuously **without sleeping/spinning down** due to inactivity. It supports Docker out of the box, making Puppeteer setup extremely reliable.

1. Create a free account on [Koyeb](https://www.koyeb.com/).
2. Click **Create Service** and choose **GitHub** as the deployment source.
3. Authorize Koyeb to access your GitHub account and select your `certification-automation` repository.
4. Set the **Builder** type to **Docker** (Koyeb will automatically detect the `Dockerfile` we created).
5. Set the Port to `3000`.
6. Click **Deploy**. Koyeb will build the container and give you a public URL (e.g., `https://your-app-name.koyeb.app`).

---

### Option 2: Hugging Face Spaces (16GB RAM — Great for Heavy Load)
Hugging Face Spaces is completely free, runs 24/7 (goes to sleep on long idle but wakes up instantly when visited), and provides a massive **16GB RAM and 2 vCPUs** on its free tier. This is excellent for handling many simultaneous PDF generations.

1. Sign up/log in to [Hugging Face](https://huggingface.co/).
2. Click your profile icon and select **New Space**.
3. Fill in a Space name (e.g. `certification-automation`).
4. Select **Docker** as the Space SDK.
5. Under **Docker template**, select **Blank**.
6. Set Space visibility to **Public**.
7. Click **Create Space**.
8. Go to your local computer terminal, add the Hugging Face Space as a git remote, and push your code there. Alternatively, you can upload your files directly to the Space's Files tab.
9. Hugging Face will build the Docker container and serve the app on its embeddable iframe (or direct URL).

---

### Option 3: Render (Easiest Setup, Free Web Service)
Render is a very popular PaaS. Their free tier will spin down (sleep) after 15 minutes of inactivity, causing a ~30-second delay on the first request after waking up, but it is free forever.

1. Sign up/log in to [Render](https://render.com/).
2. Click **New** > **Web Service**.
3. Connect your GitHub repository.
4. Configure the Web Service settings:
   - **Language:** `Node`
   - **Build Command:** `./render-build.sh`
   - **Start Command:** `npm start`
5. Click **Advanced** and add the following Environment Variable:
   - **Key:** `PUPPETEER_CACHE_DIR`
   - **Value:** `/opt/render/.cache/puppeteer`
6. Choose the **Free** instance type.
7. Click **Create Web Service**. Render will run the script, install Chrome, and deploy your site.

---

## 🛠️ Customization Guide

### 1. Edit the Certificate Template
To change the look, dates, text, signatures, or layout of the certificate:
- Open `templates/certificate_template.html` and modify the HTML structure or CSS styling.
- Keep the `[RECIPIENT NAME]` placeholder intact, as the server uses it to inject the participant's name.

### 2. Edit the Landing Page Form
To modify the text, branding, or styles of the page participants visit to download their certificate:
- Open `public/index.html` and make changes to the styling, inputs, or headers.

### 3. Adding Additional Form Fields (e.g., Team Name, Rank)
If you want participants to input extra information (like a "Team Name"):
1. In `public/index.html`, add a new input field (e.g., `<input type="text" id="team" name="team">`). Update the client-side JavaScript to send this field in the JSON request body.
2. In `templates/certificate_template.html`, add a placeholder where you want the value to appear (e.g., `[TEAM NAME]`).
3. In `server.js`, extract the new field from `req.body` and replace it in the HTML before rendering:
   ```javascript
   const { name, team } = req.body;
   let filledHtml = templateHtml
     .replace('[RECIPIENT NAME]', safeName)
     .replace('[TEAM NAME]', safeTeam);
   ```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Feel free to customize and deploy it for your own CTFs, hackathons, or workshops!
