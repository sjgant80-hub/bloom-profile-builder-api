#!/usr/bin/env node
// @ai-native-solutions/bloom-profile-builder-api
// HTTP REST proxy for @ai-native-solutions/bloom-profile-builder-sdk.
// Zero external deps beyond Node + the SDK. Runs anywhere Node runs.

import { createServer } from 'node:http';
import {
  PROBES, RINGS, LIKERT, KAPPA_BANDS,
  nextProbe, currentBloom, liveReadings,
  classifyKappaBand, computeProfile, radialSVG,
  exportProfileJSON, VERSION
} from '@ai-native-solutions/bloom-profile-builder-sdk';

const PORT = process.env.PORT ? Number(process.env.PORT) : 4210;
const HOST = process.env.HOST || '0.0.0.0';

const CORS = {
  'access-control-allow-origin':  '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type'
};

function send(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json', ...CORS });
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let s = '';
    req.on('data', c => { s += c; if (s.length > 1e6) reject(new Error('body too large')); });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
}

const ROUTES = {
  'GET /': () => ({
    name: '@ai-native-solutions/bloom-profile-builder-api',
    version: VERSION,
    sdk_version: VERSION,
    description: 'HTTP proxy for the sovereign Bloom Profile Builder SDK',
    endpoints: [
      'GET  /                 this metadata',
      'GET  /health           health check',
      'GET  /probes           full probe library',
      'GET  /rings            the 7 rings',
      'GET  /likert           the likert scale',
      'GET  /kappa-bands      the κ depth bands',
      'POST /next-probe       body: { session_state }',
      'POST /score            body: { score, ring, text? }',
      'POST /profile          body: { session_state }',
      'POST /export           body: { profile, indent? }',
      'POST /live             body: { session_state }',
      'POST /radial           body: { bloom, size? }',
      'POST /classify-kappa   body: { text }'
    ]
  }),
  'GET /health': () => ({ ok: true, ts: new Date().toISOString() }),
  'GET /probes': () => ({ probes: PROBES }),
  'GET /rings':  () => ({ rings: RINGS }),
  'GET /likert': () => ({ likert: LIKERT }),
  'GET /kappa-bands': () => ({ bands: KAPPA_BANDS }),
  'POST /next-probe': (b) => {
    const probe = nextProbe(b.session_state || { answers: [] });
    return { probe, done: probe === null };
  },
  'POST /score': (b) => {
    const ring = b.ring;
    const score = b.score;
    if (typeof ring !== 'number' || typeof score !== 'number') {
      throw new Error('score and ring are required numbers');
    }
    const band = b.text ? classifyKappaBand(b.text) : null;
    return {
      ring: RINGS[ring],
      score,
      ring_delta: score,
      text_band: band
    };
  },
  'POST /profile': (b) => {
    const s = b.session_state || { answers: [], textAll: [] };
    return { profile: computeProfile(s) };
  },
  'POST /export': (b) => ({
    blob: exportProfileJSON(b.profile || {}, b.indent || 2),
    mimeType: 'application/json',
    filename: `${(b.profile && b.profile.id) || 'bloom-profile'}.json`
  }),
  'POST /live': (b) => liveReadings(b.session_state || { answers: [], textAll: [] }),
  'POST /radial': (b) => ({ svg: radialSVG(b.bloom || [1,1,1,1,1,1,1], b.size || 300) }),
  'POST /classify-kappa': (b) => classifyKappaBand(b.text || '')
};

const server = createServer(async (req, res) => {
  if (req.method === 'OPTIONS') { res.writeHead(204, CORS); return res.end(); }
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const key = `${req.method} ${url.pathname}`;
  const handler = ROUTES[key];
  if (!handler) return send(res, 404, { error: `no route for ${key}` });
  try {
    const body = req.method === 'POST' ? await readBody(req) : {};
    const out = handler(body);
    send(res, 200, out);
  } catch (e) {
    send(res, 400, { error: e.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`bloom-profile-builder-api · listening on http://${HOST}:${PORT} · sdk v${VERSION}`);
});
