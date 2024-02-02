import { readFileSync, existsSync } from "fs";
import path from "path";

export default (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`),
          filepath = path.join(process.cwd(), "public", url.pathname === "/" ? "index.html" : url.pathname);
    let enc;
    switch (path.extname(filepath)) {
      case ".html": res.setHeader('Content-Type', 'text/html'); enc = 'utf8'; break;
      case ".js": res.setHeader('Content-Type', 'application/javascript'); enc = 'utf8'; break;
      case ".woff": res.setHeader('Content-Type', 'font/woff'); break;
      case ".woff2": res.setHeader('Content-Type', 'font/woff2'); break;
      case ".svg": res.setHeader('Content-Type', 'image/svg+xml'); enc = 'utf8'; break;
      default: return notfound(res)
    }
    if (!existsSync(filepath)) return notfound(res);
    const body = readFileSync(filepath, enc);
    return res.status(200).end(body)
  } catch (e) { return servererror(res) }
}

function notfound (res) {
  const notfoundpath = path.join(process.cwd(), "public", "404.html"),
        notfoundbody = readFileSync(notfoundpath, 'utf8');
  return res.status(404).end(notfoundbody)
}

function servererror (res) {
  const servererrorpath = path.join(process.cwd(), "public", "500.html"),
  servererrorbody = readFileSync(servererrorpath, 'utf8');
  return res.status(500).end(servererrorbody)
}