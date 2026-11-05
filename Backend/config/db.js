const mongoose = require('mongoose');

// Automatic fallback resolver for MongoDB SRV records when Windows/ISP local DNS returns EBADRESP
const resolveSrvFallback = async (srvUri) => {
  try {
    const match = srvUri.match(/mongodb\+srv:\/\/([^@]+)@([^/?]+)(\/[^?]*)?(\?.*)?/);
    if (!match) return srvUri;

    const [, userinfo, clusterHost, dbPath = '/CodeVaultDB', query = ''] = match;
    console.log(`\x1b[33m⚡ Resolving SRV records for ${clusterHost} via secure DNS-over-HTTPS fallback...\x1b[0m`);

    const srvRes = await fetch(`https://dns.google/resolve?name=_mongodb._tcp.${clusterHost}&type=SRV`);
    const srvData = await srvRes.json();

    if (!srvData.Answer || srvData.Answer.length === 0) {
      return srvUri;
    }

    const txtRes = await fetch(`https://dns.google/resolve?name=${clusterHost}&type=TXT`);
    const txtData = await txtRes.json();
    let txtParams = 'ssl=true&authSource=admin&retryWrites=true&w=majority';
    if (txtData.Answer && txtData.Answer.length > 0) {
      const rawTxt = txtData.Answer[0].data.replace(/"/g, '');
      txtParams = `ssl=true&${rawTxt}&retryWrites=true&w=majority`;
    }

    const hosts = srvData.Answer.map((ans) => {
      const parts = ans.data.trim().split(/\s+/);
      const port = parts[2] || '27017';
      const host = parts[3] ? parts[3].replace(/\.$/, '') : parts[0];
      return `${host}:${port}`;
    }).join(',');

    const directUri = `mongodb://${userinfo}@${hosts}${dbPath}?${txtParams}`;
    console.log(`\x1b[32m✔ Converted to standard replica set connection string.\x1b[0m`);
    return directUri;
  } catch (err) {
    console.warn('DNS fallback resolution notice:', err.message);
    return srvUri;
  }
};

const fixLegacySnippetIndexes = async () => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'snippets' }).toArray();
    if (collections.length > 0) {
      const indexes = await db.collection('snippets').indexes();
      for (const idx of indexes) {
        const isText = (idx.key && idx.key._fts === 'text') || idx.textIndexVersion;
        if (isText && idx.language_override !== 'none') {
          console.log(`\x1b[33mFixing legacy text index "${idx.name}" in MongoDB Atlas...\x1b[0m`);
          await db.collection('snippets').dropIndex(idx.name);
          console.log(`\x1b[32m✔ Dropped legacy text index "${idx.name}". MongoDB will rebuild it with language_override: 'none'.\x1b[0m`);
        }
      }
    }
  } catch (err) {
    console.warn('Index migration note:', err.message);
  }
};

const connectDB = async () => {
  let mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.warn(
      '\x1b[33m%s\x1b[0m',
      '⚠️  WARNING: MONGO_URI is not set in server/.env.\n' +
      'Please configure your MongoDB Atlas connection string in server/.env\n' +
      'Format: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/CodeVaultDB?retryWrites=true&w=majority'
    );
    return null;
  }

  // Auto-sanitize common connection string formatting errors:
  let cleanURI = mongoURI.trim();

  // 1. Auto-remove accidental '<' and '>' brackets around password (e.g. :<MyPassword>@ -> :MyPassword@)
  if (cleanURI.includes(':<') && cleanURI.includes('>@')) {
    cleanURI = cleanURI.replace(/:<([^>]+)>@/, (m, p) => `:${p}@`);
  }

  // 2. Auto-fix double slashes in database path (e.g. .net//CodeVaultDB -> .net/CodeVaultDB)
  cleanURI = cleanURI.replace('.mongodb.net//', '.mongodb.net/');

  try {
    let conn;
    try {
      conn = await mongoose.connect(cleanURI, {
        dbName: 'CodeVaultDB'
      });
    } catch (initialErr) {
      // If error is SRV DNS failure on Windows, try fallback resolution
      if (cleanURI.startsWith('mongodb+srv://') && initialErr.message.includes('querySrv')) {
        console.warn('\x1b[33mLocal DNS failed on SRV query (querySrv EBADRESP). Activating DoH fallback...\x1b[0m');
        const fallbackURI = await resolveSrvFallback(cleanURI);
        conn = await mongoose.connect(fallbackURI, { dbName: 'CodeVaultDB' });
      } else {
        throw initialErr;
      }
    }

    console.log(`\x1b[32m✔ MongoDB Atlas Connected: ${conn.connection.host} [Database: ${conn.connection.name}]\x1b[0m`);

    // Clean up any outdated text indexes that cause "language override unsupported" errors
    await fixLegacySnippetIndexes();

    return conn;
  } catch (error) {
    console.error(`\x1b[31m✖ MongoDB Connection Error: ${error.message}\x1b[0m`);
    console.error('Please verify your MongoDB Atlas credentials, cluster whitelist (0.0.0.0/0), and network connectivity.');
    return null;
  }
};

module.exports = connectDB;
