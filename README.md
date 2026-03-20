# LankanBook

> A community-driven platform documenting establishments in Sri Lanka that discriminate against local residents.

Inspired by the historic [Negro Motorist Green Book](https://en.wikipedia.org/wiki/Negro_Motorist_Green_Book), LankanBook empowers communities to share and verify experiences of discrimination—whether dual pricing, denial of entry, or selective enforcement of policies against Sri Lankan residents.

## Why This Project Exists

Sri Lanka's tourism industry often treats local residents as second-class citizens—charging foreigners higher prices, denying entry to locals, or enforcing discriminatory policies. This project creates a transparent, community-verified record of such establishments.

**Our philosophy:** Community upvoting verifies authenticity. If multiple people report the same establishment, it gains credibility.

## Features

- **Browse Establishments** — Search and filter reports by province, name, or location
- **Community Testimonies** — Submit and upvote firsthand accounts of discrimination
- **Evidence Gallery** — Attach photos and videos to reports
- **Verification System** — Upvote system helps surface credible, repeated complaints
- **Responsive Design** — Optimized for mobile and desktop

## Tech Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | [Next.js 16](https://nextjs.org/) (App Router) |
| Language      | TypeScript                                     |
| Database      | PostgreSQL via [Neon](https://neon.tech/)      |
| ORM           | [Drizzle ORM](https://orm.drizzle.team/)       |
| Styling       | Tailwind CSS                                   |
| Media Storage | [@vercel/blob](https://vercel.com/blob)        |
| Deployment    | [Vercel](https://vercel.com/)                  |

## Getting Started

### Prerequisites

- Node.js 18+
- A Neon PostgreSQL database
- A Vercel Blob account (for media uploads)

### Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host/dbname
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

```bash
npm install
```

### Database Setup

Run migrations to create tables:

```bash
npx drizzle-kit push
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build

```bash
npm run build
```

## Database Schema

### Establishments

| Column        | Type         | Description                   |
| ------------- | ------------ | ----------------------------- |
| `id`          | serial       | Primary key                   |
| `name`        | varchar(255) | Establishment name            |
| `location`    | varchar(255) | City/area                     |
| `province`    | varchar(100) | Sri Lankan province           |
| `description` | text         | Initial discrimination report |
| `mediaUrls`   | text         | JSON array of media URLs      |
| `upvotes`     | integer      | Verification score            |
| `verified`    | boolean      | Admin verification            |
| `createdAt`   | timestamp    | Creation date                 |

### Reports

| Column            | Type         | Description              |
| ----------------- | ------------ | ------------------------ |
| `id`              | serial       | Primary key              |
| `establishmentId` | integer      | FK to establishments     |
| `testimony`       | text         | Community report         |
| `mediaUrls`       | text         | JSON array of media URLs |
| `reporterName`    | varchar(255) | Optional reporter name   |
| `upvotes`         | integer      | Verification score       |
| `createdAt`       | timestamp    | Submission date          |

## API Endpoints

### Establishments

- `GET /api/establishments` — List all establishments (sorted by upvotes)
- `POST /api/establishments` — Create new establishment report
- `GET /api/establishments/[id]` — Get establishment by ID
- `POST /api/establishments/[id]/upvote` — Increment upvote count

### Reports

- `GET /api/reports?establishmentId=X` — Get reports for establishment
- `POST /api/reports` — Submit new testimony

### Media

- `POST /api/upload` — Upload media file (images/videos)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

---

Built with ❤️ for the Sri Lankan community
