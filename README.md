# n8n Marketplace

A modern marketplace for n8n automation workflows built with Next.js 15, React 19, and Stripe integration.

## 🚀 Features

- **Browse Workflows**: Discover professionally built n8n automation templates
- **Secure Payments**: Stripe-powered checkout system
- **Instant Downloads**: Download n8n workflow JSON files immediately after purchase
- **Mock Mode**: Development mode with mock payments for testing
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Payments**: Stripe
- **File Storage**: Vercel Blob (configurable)
- **Package Manager**: pnpm

## 📦 Available Workflows

1. **E-commerce Order Processing** ($49)
   - Complete automation for order processing
   - Inventory updates and customer notifications
   - Shopify and Gmail integrations

2. **Social Media Content Pipeline** ($39)
   - Automated content creation and scheduling
   - Performance tracking across platforms
   - OpenAI, Twitter, and LinkedIn integrations

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm
- Stripe account (for real payments)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd n8n-marketplace
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# For development with mock payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key

# For production with real Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# App configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Vercel Blob (optional)
BLOB_READ_WRITE_TOKEN=your_blob_token
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🔧 Development Mode

The app includes a mock mode for development:

- Uses mock Stripe sessions (no real payments)
- Bypasses Stripe API calls for testing
- Generates downloadable n8n workflow files
- Perfect for development and testing

To enable mock mode, use these environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
```

## 🏗 Project Structure

```
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes
│   │   ├── checkout/      # Stripe checkout
│   │   ├── download/      # File downloads
│   │   ├── purchase/      # Purchase verification
│   │   └── webhooks/      # Stripe webhooks
│   ├── dashboard/         # User dashboard
│   ├── download/          # Download page
│   ├── success/           # Success page
│   └── workspace/         # Workspace details
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utilities
└── public/               # Static assets
```

## 🔄 Workflow Integration

The downloaded n8n workflows are properly formatted and include:

- Complete node configurations
- Connection mappings
- Credential requirements
- Setup documentation

### How to Use Downloaded Workflows

1. Download the JSON file from the marketplace
2. Open your n8n instance
3. Go to Workflows → Import from File
4. Select the downloaded JSON file
5. Configure your credentials and connections
6. Activate the workflow

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

```bash
pnpm build
pnpm start
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | For webhooks |
| `NEXT_PUBLIC_BASE_URL` | App base URL | Yes |
| `NEXTAUTH_URL` | NextAuth URL | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret | Yes |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token | Optional |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email [your-email] or create an issue on GitHub.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Payments powered by [Stripe](https://stripe.com/)
- Icons from [Lucide](https://lucide.dev/)
