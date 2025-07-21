# ThoughtVibe Next.js

A modern blogging platform built with Next.js, TypeScript, and MongoDB. This is a migration from the original Express.js/EJS application to a modern React-based architecture.

## Features

- **User Authentication**: Register, login, and user management
- **Blog Management**: Create, read, update, and delete blog posts
- **Reading Lists**: Save and manage your favorite blog posts
- **Reactions**: Like and interact with blog posts
- **User Profiles**: View user profiles and their blog posts
- **Responsive Design**: Modern UI with Material Design principles
- **Image Upload**: Cloudinary integration for blog banners and profile photos
- **Markdown Support**: Rich text editing with syntax highlighting

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: Custom JWT/session management
- **Styling**: Custom CSS with Material Design
- **Image Storage**: Cloudinary
- **Markdown**: markdown-it with syntax highlighting

## Project Structure

```
thoughtvibe-nextjs/
├── src/
│   ├── app/
│   │   ├── api/                    # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── blogs/             # Blog management endpoints
│   │   │   ├── reading-list/      # Reading list endpoints
│   │   │   └── profile/           # Profile endpoints
│   │   ├── components/            # React components
│   │   │   ├── TopAppBar.tsx      # Navigation bar
│   │   │   ├── BlogCard.tsx       # Blog post card
│   │   │   └── Pagination.tsx     # Pagination component
│   │   ├── login/                 # Login page
│   │   ├── register/              # Registration page
│   │   └── page.tsx               # Home page
│   ├── lib/                       # Utility libraries
│   │   ├── cloudinary.ts          # Cloudinary configuration
│   │   ├── db.ts                  # Database connection
│   │   └── markdown.ts            # Markdown configuration
│   ├── models/                    # MongoDB models
│   │   ├── userModel.ts           # User schema
│   │   └── blogModel.ts           # Blog schema
│   └── utils/                     # Utility functions
│       ├── getPagination.ts       # Pagination logic
│       ├── getReadingTime.ts      # Reading time calculator
│       └── generateUsername.ts    # Username generator
├── public/
│   ├── css/                       # Stylesheets
│   ├── images/                    # Static images
│   └── js/                        # Client-side JavaScript
└── env.example                    # Environment variables template
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB instance
- Cloudinary account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thoughtvibe-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # MongoDB Configuration
   MONGO_CONNECTION_URL=mongodb://localhost:27017/MindScribe
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Session Configuration
   SESSION_SECRET=your_session_secret_key_here
   SESSION_MAX_AGE=86400000
   
   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Blogs
- `GET /api/blogs` - Get all blogs with pagination
- `POST /api/blogs/create` - Create new blog
- `GET /api/blogs/[blogId]` - Get blog details
- `DELETE /api/blogs/[blogId]/delete` - Delete blog

### Reactions
- `POST /api/blogs/[blogId]/reaction` - Add reaction
- `DELETE /api/blogs/[blogId]/reaction` - Remove reaction

### Reading List
- `GET /api/reading-list` - Get user's reading list
- `POST /api/reading-list/[blogId]` - Add to reading list
- `DELETE /api/reading-list/[blogId]` - Remove from reading list

### Profiles
- `GET /api/profile/[username]` - Get user profile

## Migration from Express.js

This project is a complete migration from the original Express.js/EJS application. Key changes include:

### Backend Changes
- **Express Routes → Next.js API Routes**: All Express controllers converted to Next.js API routes
- **EJS Templates → React Components**: Server-side rendering replaced with client-side React components
- **Session Management**: Express sessions replaced with NextAuth.js (planned) or custom JWT implementation
- **TypeScript**: Added full TypeScript support for better type safety

### Frontend Changes
- **Component-Based Architecture**: Modular React components for better maintainability
- **Client-Side Routing**: Next.js routing for faster navigation
- **State Management**: React hooks for local state management
- **Modern UI**: Enhanced user experience with React

### Database
- **Same Models**: MongoDB models remain largely unchanged
- **TypeScript Interfaces**: Added TypeScript interfaces for better type safety
- **Connection Optimization**: Improved database connection handling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Material Design principles for UI

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Configure build settings for Next.js
- **Railway**: Deploy with MongoDB add-on
- **DigitalOcean**: Use App Platform with MongoDB managed database

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the Apache License 2.0.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a migration project. For the original Express.js version, see the parent repository.
