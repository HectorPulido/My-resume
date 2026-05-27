# hectorpulido.net

Hector Pulido's personal site. Portfolio, consulting and mentoring services, and a static bilingual blog (Spanish by default, English under `/en/`).

Built with [Astro](https://astro.build), served with `nginx:alpine`, deployed to a self-hosted VPS via Docker.

## Stack

- Astro 5 with Content Collections (Markdown and JSON).
- Strict TypeScript.
- Plain CSS with design tokens (no frameworks).
- Native Astro i18n, no client JS.
- Static build output in `dist/`.

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # generates dist/
npm run preview  # serves dist/ locally
```

Requirements: Node 20 or newer.

## How to add a blog post

1. Create a Markdown file at `src/content/blog/es/mi-post.md` or `src/content/blog/en/my-post.md`.
2. Minimum frontmatter:

   ```markdown
   ---
   title: "Post title"
   description: "Short summary used for meta tags and listings."
   date: 2026-05-30
   lang: en
   tags: [agents, ai]
   draft: false
   ---

   Markdown body.
   ```

3. Run `npm run dev` to preview. The post shows up automatically in `/blog/` and on the home page.

When there are no published posts (everything in `draft: true` or the folder is empty), the blog link disappears from the nav and the blog section disappears from the home page.

## How to edit the services

`src/content/services/services.json` holds the full list in Spanish and English. Each service has `slug`, `title`, `pitch` and `bullets`. After editing, run `npm run build` to refresh.

## How to edit the "About me" page

Edit `src/content/about/es.md` and `src/content/about/en.md`. Frontmatter takes `title` and `tagline`, the body is Markdown.

## How to edit the open source projects

`src/content/projects/projects.json` holds the curated list of repos shown on the home page in Spanish and English. Each project has `slug`, `name`, `pitch`, optional `highlight`, `tags`, `url` and an optional `featured` flag that makes the card span the full grid width on desktop.

## How the latest videos are fetched

`src/lib/youtube.ts` fetches the official YouTube RSS feed for channel `UCS_iMeH0P0nsIDPvBaJckOw` at build time, with an 8s timeout and in-process memoization. If the fetch fails, the videos section is silently hidden so the build keeps succeeding.

## Deploy to the VPS

```bash
git pull
docker compose build
docker compose up -d
```

The container listens on `:8080`. The VPS reverse proxy (Caddy, Traefik or host nginx) terminates TLS for `hectorpulido.net` and forwards to `127.0.0.1:8080`.

### Caddy example

```
hectorpulido.net {
    reverse_proxy 127.0.0.1:8080
}
```

### nginx host example

```
server {
    listen 443 ssl http2;
    server_name hectorpulido.net;
    ssl_certificate     /etc/letsencrypt/live/hectorpulido.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hectorpulido.net/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Structure

```
src/
  content/          # Editable Markdown and JSON
    about/
    services/
    projects/
    blog/
  components/       # Reusable Astro components
    pages/          # Page-level components (HomePage, AboutPage, etc.)
  layouts/          # BaseLayout and PostLayout
  lib/              # Helpers (hasBlogPosts, youtube)
  i18n/             # UI strings dictionary
  pages/            # Routes. Mirror under en/ for English.
  styles/global.css
public/             # Static assets (favicon, robots, og.png)
Dockerfile
docker-compose.yml
nginx.conf
```
