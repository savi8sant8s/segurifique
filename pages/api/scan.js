import zaproxy from '../../services/zap.service';

export default async function handler(req, res) {
  const response = await zaproxy.core.alertsSummary(req.query.url);
  res.status(200).json({ response })
}
