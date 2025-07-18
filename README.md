# SMK1Presence

> A smart, real-time school attendance system built for SMK students and teachers — optimizing presence tracking through modern web technologies and streamlined reporting.

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/ArvinoDel/SMK1Presence/graphs/commit-activity)  
[![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://opensource.org/)

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## About

**SMK1Presence** is a full-stack, smart school attendance web application designed to digitize and streamline the presence-checking process for both students and administrators at SMK institutions. It introduces a seamless experience with real-time analytics, QR code scanning, and automatic report generation.

### 🎯 Key Features
- 📍 **Real-Time Check-In**: Accurate, real-time student and teacher check-ins.
- 🔐 **QR Code Scanning**: Role-based QR login and authentication system.
- 🧾 **Automated Reports**: Generate PDF-based attendance reports by date and user.
- 📊 **Realtime Dashboard**: Track attendance metrics with dynamic visual feedback.
- 🎓 **Multi-role Support**: Built-in admin, teacher, and student privileges.

### ⚙️ Tech Stack
- **Frontend**: [Next.js](https://nextjs.org/), [React.js](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/), [Express](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Auth**: JWT & Session-based Authentication
- **Analytics**: Real-time metrics and logs for performance and usage

## Installation

To get SMK1Presence up and running locally:

```bash
# 1. Clone the repository
git clone https://github.com/ArvinoDel/SMK1Presence.git
cd SMK1Presence

# 2. Copy the environment template and configure
cp .env.example .env

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

You will also need to set up your MongoDB URI and JWT secrets in the `.env` file.

## Usage

Once the development server is running, navigate to `http://localhost:3000` and log in as a student or admin to start tracking presence data in real time. Admins can access the dashboard to download reports and manage user data.

## Contributing

We welcome open-source contributions! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`
3. Make your changes and commit them: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Submit a pull request.

### ✅ Coding Standards

- Follow the existing folder and file structure.
- Use consistent naming conventions (`camelCase` for variables, `PascalCase` for components).
- Write clear, concise, and meaningful commit messages.
- Add unit or integration tests for new features if applicable.

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for full details.

## Contact

- **Name:** Andika Supriyadi Nur Maulana & Faiz Firmansyah  
- **Email:** [andikasupriyadinurmaulana@gmail.com](mailto:andikasupriyadinurmaulana@gmail.com)  
- **GitHub:** [ArvinoDel](https://github.com/ArvinoDel)  
- **Live Project Demo:** Coming Soon  
- **Repo:** [https://github.com/ArvinoDel/SMK1Presence](https://github.com/ArvinoDel/SMK1Presence)
