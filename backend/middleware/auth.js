const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'gizli_anahtar';

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ hata: 'Token gerekli' });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ hata: 'Geçersiz token' });
  }
}

function adminRequired(req, res, next) {
  authRequired(req, res, () => {
    if (req.user.rol !== 'admin') return res.status(403).json({ hata: 'Admin yetkisi gerekli' });
    next();
  });
}

module.exports = { authRequired, adminRequired, SECRET };
