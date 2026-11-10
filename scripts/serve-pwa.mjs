import { createServer } from 'node:http';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT ?? 4173);
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') return false;
    throw error;
  }
}

async function resolveRequest(pathname) {
  const decodedPath = decodeURIComponent(pathname);
  const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
  const requestedPath = path.resolve(root, relativePath);
  if (!requestedPath.startsWith(`${root}${path.sep}`) && requestedPath !== root) return null;

  const candidates = [requestedPath];
  if (!path.extname(requestedPath)) {
    candidates.push(`${requestedPath}.html`, path.join(requestedPath, 'index.html'));
  }

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  try {
    const url = new URL(request.url ?? '/', 'http://localhost');
    const filePath = await resolveRequest(url.pathname);
    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }

    const content = await readFile(filePath);
    const extension = path.extname(filePath);
    const headers = {
      'Content-Type': mimeTypes[extension] ?? 'application/octet-stream',
      'Cache-Control': extension === '.html' || path.basename(filePath) === 'sw.js'
        ? 'no-cache'
        : 'public, max-age=3600',
    };
    response.writeHead(200, headers);
    if (request.method === 'HEAD') response.end();
    else response.end(content);
  } catch (error) {
    console.error('Failed to serve PWA request:', error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Internal server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Pootmaat preview: http://localhost:${port}`);
});
