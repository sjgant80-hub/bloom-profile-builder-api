// bloom-profile-builder-api · Express HTTP wrapper around bloom-profile-builder-sdk · MIT · AI-Native Solutions
import express from 'express';

const app = express();
app.use(express.json({ limit: '10mb' }));

app.get('/health', (_req, res) => res.json({ ok: true, tool: 'bloom-profile-builder', version: '1.0.0' }));

app.post('/blankSession', async (req, res) => {
  try {
    const { blankSession } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof blankSession === 'function' ? await blankSession(req.body) : { error: 'blankSession not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/accumulate', async (req, res) => {
  try {
    const { accumulate } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof accumulate === 'function' ? await accumulate(req.body) : { error: 'accumulate not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/currentBloomVec', async (req, res) => {
  try {
    const { currentBloomVec } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof currentBloomVec === 'function' ? await currentBloomVec(req.body) : { error: 'currentBloomVec not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/currentText', async (req, res) => {
  try {
    const { currentText } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof currentText === 'function' ? await currentText(req.body) : { error: 'currentText not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/showTab', async (req, res) => {
  try {
    const { showTab } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof showTab === 'function' ? await showTab(req.body) : { error: 'showTab not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/renderLegend', async (req, res) => {
  try {
    const { renderLegend } = await import('@ai-native-solutions/bloom-profile-builder-sdk');
    const out = typeof renderLegend === 'function' ? await renderLegend(req.body) : { error: 'renderLegend not callable' };
    res.json(out);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('bloom-profile-builder-api listening on :' + PORT));
