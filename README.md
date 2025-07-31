# EduNova - Modern Learning Platform

A comprehensive learning management system built with Next.js 15, Sanity CMS, and Clerk authentication. This platform provides a modern, scalable solution for online education with advanced features for course management, progress tracking, and user engagement.

## 🚀 Features

### Core Features
- **User Authentication** - Secure login/signup with Clerk
- **Course Management** - Create, organize, and manage courses with modules and lessons
- **Progress Tracking** - Real-time progress monitoring and completion status
- **Search Functionality** - Advanced course search with filters
- **Responsive Design** - Mobile-first design with dark mode support
- **Admin Dashboard** - Comprehensive course management interface

### Technical Features
- **Next.js 15** - Latest App Router with server components
- **TypeScript** - Full type safety throughout the application
- **Sanity CMS** - Headless CMS for content management
- **Clerk Auth** - Modern authentication and user management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Sanity CMS
- **Authentication**: Clerk
- **Database**: Sanity (MongoDB-based)
- **Styling**: Tailwind CSS, Radix UI
- **Deployment**: Vercel-ready

## 📁 Project Structure

```
edunova/
├── app/                          # Next.js App Router
│   ├── (admin)/                  # Admin routes
│   ├── (dashboard)/              # Dashboard routes
│   ├── (user)/                   # User-facing routes
│   ├── actions/                  # Server actions
│   └── api/                      # API routes
├── components/                   # React components
│   ├── ui/                       # UI components
│   ├── dashboard/                # Dashboard components
│   └── providers/                # Context providers
├── sanity/                       # Sanity CMS configuration
│   ├── lib/                      # Sanity utilities
│   ├── schemaTypes/              # Content schemas
│   └── structure.ts              # Studio structure
├── lib/                          # Utility functions
└── middleware.ts                 # Next.js middleware
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Sanity account
- Clerk account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dinobrefo/EduNova-MINIPROJECT.git
   cd EduNova-MINIPROJECT
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Sanity Configuration
   NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
   NEXT_PUBLIC_SANITY_DATASET=production
   SANITY_API_TOKEN=your_api_token

   # Clerk Configuration
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Start Sanity Studio** (in a separate terminal)
   ```bash
   npx sanity dev --port 3333
   ```

## 🔧 Configuration

### Sanity CMS Setup

1. **Create a Sanity project** at [sanity.io](https://sanity.io)
2. **Get your project ID** from the Sanity dashboard
3. **Generate an API token** with Editor permissions
4. **Update your environment variables** with the Sanity credentials

### Clerk Authentication Setup

1. **Create a Clerk application** at [clerk.com](https://clerk.com)
2. **Get your API keys** from the Clerk dashboard
3. **Update your environment variables** with the Clerk credentials

## 📚 Usage

### For Students
- Browse available courses
- Enroll in courses
- Track learning progress
- Complete lessons and modules
- View course history

### For Instructors/Admins
- Create and manage courses
- Organize content into modules and lessons
- Monitor student progress
- Manage course content through Sanity Studio

## 🎨 Features in Detail

### Course Management
- **Modular Structure**: Courses are organized into modules and lessons
- **Rich Content**: Support for text, video, and interactive content
- **Progress Tracking**: Real-time progress monitoring
- **Completion Status**: Track lesson and module completion

### User Experience
- **Responsive Design**: Works seamlessly on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Search**: Find courses quickly with advanced search
- **Navigation**: Intuitive course navigation with sidebar

### Admin Features
- **Content Management**: Easy content creation through Sanity Studio
- **User Management**: Track student enrollments and progress
- **Analytics**: Monitor course performance and engagement

## 🚀 Deployment

### Vercel Deployment

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** with automatic deployments on push

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Sanity](https://sanity.io/) for the headless CMS
- [Clerk](https://clerk.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub or contact the maintainers.

---

**Built with ❤️ by the EduNova team**
