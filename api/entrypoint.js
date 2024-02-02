import { readFileSync, existsSync } from "fs";
import path from "path";

export default (req, res) => {
  try {
    const url = new URL(req.url, `https://${req.headers.host}`),
          filepath = path.join(process.cwd(), "public", url.pathname === "/" ? "index.html" : url.pathname);
    switch (path.extname(filepath)) {
      case ".html": res.setHeader('Content-Type', 'text/html'); break;
      case ".js": res.setHeader('Content-Type', 'application/javascript'); break;
      default: return notfound(res)
    }
    if (!existsSync(filepath)) return notfound(res);
    const body = readFileSync(filepath, 'utf8');
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