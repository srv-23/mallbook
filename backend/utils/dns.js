const dns = require('dns');

// An SRV seed list (mongodb+srv://) is resolved with DNS SRV/TXT queries, which
// Node answers through c-ares using the OS resolver list. Some Windows setups
// report that list as 127.0.0.1 even though normal lookups work, and then the
// driver fails with:
//
//   MongoServerSelectionError: querySrv ECONNREFUSED _mongodb._tcp.<cluster>
//
// That is a resolver problem, not a credentials or allowlist problem. Setting
// DNS_SERVERS gives c-ares an explicit resolver without touching the machine
// configuration. It is opt-in because pointing an application at public DNS can
// break resolution of internal hostnames.
const applyDnsOverride = () => {
  const servers = (process.env.DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (servers.length === 0) return false;

  dns.setServers(servers);
  console.log(`ℹ️  DNS resolver override active: ${servers.join(', ')}`);
  return true;
};

const isDnsFailure = (error) => {
  const message = String((error && error.message) || '');
  return /querySrv|queryTxt|ECONNREFUSED|ENOTFOUND|ESERVFAIL/i.test(message);
};

const dnsHint = (uri = '') => {
  const lines = [
    '   The SRV/TXT lookup for the cluster failed. This is a DNS resolver issue,',
    '   not a credentials or IP allowlist issue.'
  ];

  if (String(uri).startsWith('mongodb+srv://')) {
    lines.push(
      '   Fix one of these ways:',
      '     1. Add DNS_SERVERS=8.8.8.8,1.1.1.1 to .env (works around a broken local resolver)',
      '     2. Use the standard (non-SRV) connection string from Atlas: Cluster -> Connect -> Drivers',
      '     3. Repair the machine resolver: ipconfig /flushdns, then check the adapter DNS servers'
    );
  }

  return lines.join('\n');
};

module.exports = { applyDnsOverride, isDnsFailure, dnsHint };
