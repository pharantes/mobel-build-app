# Möbel Build AI - Setup Instructions

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Then fill in the following variables:

#### MongoDB Connection
```
MONGODB_URI=your_mongodb_connection_string
```
Get a free MongoDB database at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

#### NextAuth Configuration
```
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000
```
Generate a secret: `openssl rand -base64 32`

#### AI Model (Optional - for future use)
```
AI_MODEL_API_URL=
AI_MODEL_API_KEY=
USE_AI_MODEL=false
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
mobel-build-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Dashboard page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── project/           # Project pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   ├── lib/                   # Core libraries
│   │   └── furnitureEngine/   # Rule-based furniture generation
│   ├── models/                # MongoDB schemas
│   └── utils/                 # Utility functions
├── public/                    # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

## 🔧 Features

- ✅ User authentication (NextAuth.js)
- ✅ Project management (CRUD operations)
- ✅ Rule-based furniture design generation
- ✅ CAD file export (DXF & SVG)
- ✅ Technical specifications (cut lists, hardware)
- ✅ Assembly instructions
- ✅ Material cost estimation
- ✅ Responsive UI with Tailwind CSS

## 🎯 Supported Furniture Types

1. **Corner Shelves** - Optimized for corner spaces
2. **Wall Shelves** - Floating and mounted storage
3. **Cabinets** - Custom storage with doors/drawers
4. **Desks** - Work surfaces with optional drawers

## 📊 Database Models

- **User** - Authentication and user data
- **Project** - Furniture design projects
- **Material** - Material catalog and pricing
- **PricingInfo** - Cost breakdowns per project

## 🚢 Deployment to Vercel

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

## 🤖 Future AI Integration

The app is built with an adapter pattern that makes it easy to swap the rule-based engine with an AI model:

1. Train your AI model on furniture design data
2. Deploy model to an inference API
3. Update environment variables:
   ```
   AI_MODEL_API_URL=https://your-model-api.com
   AI_MODEL_API_KEY=your_api_key
   USE_AI_MODEL=true
   ```
4. The `aiAdapter.ts` will automatically use AI instead of rules!

## 📝 Development Notes

### Rule-Based Generation
Currently uses carpentry formulas and standards to generate:
- Cut lists with exact dimensions
- Hardware requirements based on load calculations
- Assembly instructions from templates
- CAD coordinates for technical drawings

### Material Calculations
- Standard sheet sizes: 1220mm × 2440mm
- Waste factor: 10%
- Load capacity calculations based on material type
- Screw spacing and sizing based on dimensions

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📚 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **CAD**: Custom DXF/SVG generator
- **Deployment**: Vercel

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Check connection string format
- Ensure IP whitelist in MongoDB Atlas
- Verify network access

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Authentication Issues
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies

## 📄 License

MIT

## 👥 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For questions or issues, contact: support@mobel-build.ai
