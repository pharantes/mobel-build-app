# Möbel Build AI

An intelligent furniture design application that generates technical drawings, cut lists, assembly instructions, and material pricing for custom furniture pieces.

## Features

- 🛠️ **Custom Furniture Design**: Input dimensions and specifications for corner shelves, wall shelves, cabinets, and desks
- 📐 **Technical Drawings**: Automatic CAD file generation (DXF format)
- 📋 **Cut Lists**: Precise material dimensions and quantities
- 🔧 **Assembly Instructions**: Step-by-step building guide
- 💰 **Material Pricing**: Cost estimation based on material catalog
- 👤 **User Accounts**: Save and manage multiple projects
- 🤖 **AI-Ready**: Architecture supports future AI model integration

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: MongoDB with Mongoose ODM
- **CAD Generation**: MakerJS, DXF Writer
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mobel-build-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Update environment variables in `.env.local`:
- Add your MongoDB connection string
- Generate a NextAuth secret: `openssl rand -base64 32`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/              # Core libraries
│   └── furnitureEngine/  # Rule-based furniture generation
├── models/           # MongoDB schemas
└── utils/            # Utility functions
```

## Usage

1. **Register/Login**: Create an account
2. **New Project**: Click "Create New Project"
3. **Specify Furniture**: Choose type and enter dimensions
4. **Generate**: Get technical drawings, cut list, and pricing
5. **Download**: Export CAD files for manufacturing

## Future Enhancements

- AI model integration for advanced designs
- Support for more furniture types
- 3D visualization
- Material supplier integration
- Community sharing platform

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
# Deployment trigger
