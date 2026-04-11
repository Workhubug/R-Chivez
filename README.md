# R-CHIVEZ - Artist Admin Portal (Standalone React)# Getting Started with Create React App



A premium dark-themed web application for African artists to **archive, distribute, and license their music**. This is now a fully standalone React app with no backend dependencies.This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).



## 🎯 Features## Available Scripts



- ✅ **Artist Authentication** - Register & login with emailIn the project directory, you can run:

- ✅ **Music Archive** - Upload and organize your music files

- ✅ **Distribution Management** - Configure distribution platforms (Spotify, Apple Music, Boomplay)### `npm start`

- ✅ **Licensing** - Set up sync, NFT, and commercial licensing

- ✅ **Analytics** - Track streams and earningsRuns the app in the development mode.\

- ✅ **Wallet & Withdrawals** - Manage your earnings and withdrawalsOpen [http://localhost:3000](http://localhost:3000) to view it in your browser.

- ✅ **Responsive Design** - Works on all devices

- ✅ **Dark Premium Theme** - Beautiful dark UI with gold/orange accentsThe page will reload when you make changes.\

You may also see any lint errors in the console.

## 🚀 Quick Start

### `npm test`

### Prerequisites

- Node.js 16+ Launches the test runner in the interactive watch mode.\

- npm or yarnSee the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



### Installation### `npm run build`



```bashBuilds the app for production to the `build` folder.\

# Navigate to the projectIt correctly bundles React in production mode and optimizes the build for the best performance.

cd R-Chivez

The build is minified and the filenames include the hashes.\

# Install dependenciesYour app is ready to be deployed!

npm install

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Start the development server

npm start### `npm run eject`

```

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

The app will open at `http://localhost:3000`

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

### Build for Production

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

```bash

npm run buildYou don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

```

## Learn More

This creates an optimized production build in the `build/` folder.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

## 📂 Project Structure

To learn React, check out the [React documentation](https://reactjs.org/).

```

R-Chivez/### Code Splitting

├── public/              # Static assets

│   └── index.html      # HTML templateThis section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

├── src/

│   ├── App.js          # Main app with routing & auth### Analyzing the Bundle Size

│   ├── pages/

│   │   ├── LandingPage.jsx     # Home pageThis section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

│   │   ├── AuthPage.jsx        # Login/Register

│   │   └── Dashboard.jsx       # Main dashboard### Making a Progressive Web App

│   ├── components/

│   │   ├── dashboard/This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

│   │   │   ├── DashboardHome.jsx

│   │   │   ├── ArchiveSection.jsx### Advanced Configuration

│   │   │   ├── DistributionSection.jsx

│   │   │   ├── LicensingSection.jsxThis section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

│   │   │   ├── WalletSection.jsx

│   │   │   ├── AnalyticsSection.jsx### Deployment

│   │   │   └── FileDetailPanel.jsx

│   │   └── ui/                 # Shadcn UI componentsThis section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

│   ├── lib/

│   │   ├── mockData.js        # Local storage & mock data### `npm run build` fails to minify

│   │   └── utils.js           # Utility functions

│   └── hooks/This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

│       └── use-toast.js       # Toast hook
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔐 Data Storage

All data is stored **locally in your browser's localStorage**:
- **Users** - Artist accounts and wallet balances
- **Files** - Music archive metadata
- **Transactions** - Earnings and withdrawal history

Data persists across browser sessions but is **local to your device only**.

## 💻 Technology Stack

- **Frontend Framework**: React 19
- **Routing**: React Router v7
- **Styling**: Tailwind CSS 3
- **UI Components**: Shadcn UI + Radix UI
- **Icons**: Phosphor Icons
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Notifications**: Sonner

## 🎨 Design

- **Theme**: Dark premium with gold/orange accents
- **Colors**:
  - Background: `#050505`
  - Surface: `#121214`
  - Primary: `#FF6B00` (warm orange)
  - Secondary: `#D4AF37` (luxury gold)
  - Accent: `#00BFFF` (cyan)

## 📦 Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🧪 Testing the App

### Test Accounts
The app includes demo data seeding. You can:

1. **Register a new account** - Use any email/password
2. **Seed demo files** - Click "Seed Demo Data" in the Dashboard
3. **Explore features** - Try all sections with mock data

### Sample Credentials
```
Email: demo@rchivez.com
Password: demo123
Artist Name: Demo Artist
```

## 📝 Using the App

### Landing Page
- View platform features
- Read about the core modules
- Call-to-action buttons to get started

### Authentication
- Register with email, password, and artist name
- Login with your credentials
- Data is persisted in localStorage

### Dashboard Sections

#### 📦 Archive
- View all uploaded files
- Add new files with metadata
- Edit file details (title, genre, duration)
- Mark files as archived/distributed/licensed
- Delete files

#### 📊 Analytics
- View total streams and earnings
- See daily stream and earnings trends (30 days)
- Geographic breakdown by country
- File statistics

#### 🌐 Distribution
- Configure distribution platforms
- Select which DSPs to distribute to
- Track distribution status per file

#### 🎯 Licensing
- Set license types (sync, NFT, commercial)
- Configure license prices
- View licensing status

#### 💰 Wallet
- Check your balance
- View transaction history
- Initiate withdrawals
- Choose withdrawal methods

## 🔄 Data Synchronization

All operations are **instant and local**. There is no backend server to sync with. This is a **completely client-side application**.

### How Data Works:
1. **Login/Register** → User stored in localStorage
2. **Create File** → File added to user's file collection
3. **Update File** → Changes saved immediately to localStorage
4. **Withdraw** → Transaction recorded and balance updated
5. **Analytics** → Calculated from local files and transactions

## 🌐 Deployment

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages
```bash
npm run build
# Follow GitHub Pages deployment instructions
```

### Deploy to Netlify
```bash
npm run build
# Drag and drop the `build/` folder to Netlify
```

## 🐛 Troubleshooting

### App won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Data disappeared
- Data is stored in browser localStorage
- Clearing browser data will delete everything
- Use browser DevTools → Application → Local Storage to inspect

### Port 3000 already in use
```bash
# Kill the process or use a different port
npm start -- --port 3001
```

## 📄 License

This project is proprietary and for educational purposes.

## 👨‍💻 Support

For issues or feature requests, please create an issue in the repository.

---

Built with ❤️ for African Artists
