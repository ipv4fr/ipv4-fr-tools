# ipv4.fr tools

Network and web data tools for developers and AI agents: DNS, WHOIS, TLS certificates, email validation, IP geolocation, IP blacklists, HTTP headers, an AI domain security audit, page and PDF to Markdown, and company profiles.

Three ways to use them:

| Access | Who it is for | Payment |
|---|---|---|
| [REST API](https://ipv4.fr/docs.html) with an API key | apps and scripts | free tier (25 requests/day), or plans paid in crypto or Telegram Stars |
| [x402](https://x402.org) pay-per-call | AI agents and wallets | USDC on Base, per request, no account |
| [MCP server](#mcp-server) at `https://ipv4.fr/mcp` | AI assistants and agent frameworks | 20 free tool calls/day, then an API key |

Machine-readable descriptions: [openapi.json](https://ipv4.fr/openapi.json) and the x402 index at [ipv4.fr/x402/v1](https://ipv4.fr/x402/v1).

## x402 pay-per-call endpoints

Base URL `https://ipv4.fr/x402/v1`. Network Base mainnet (`eip155:8453`), asset USDC. Both x402 v1 and v2 clients are supported. You are only charged when the call succeeds.

| Endpoint | Price (USDC) | Returns |
|---|---|---|
| `GET /dns/{domain}` | 0.002 | A, AAAA, MX, TXT, NS (optional `types=`) |
| `GET /geo/{ip}` | 0.002 | country, city, ISP, coordinates, timezone |
| `GET /whois/{domain}` | 0.003 | registrar, creation and expiry dates, name servers |
| `GET /ssl/{host}` | 0.003 | certificate validity, issuer, expiry, SAN |
| `GET /blacklist/{ip}` | 0.003 | listing status on Barracuda, SpamCop, UCEPROTECT |
| `GET /headers?url=` | 0.003 | HTTP status and response headers |
| `GET /email/{email}` | 0.005 | syntax, MX, SMTP check, disposable and role detection |
| `GET /markdown?url=` | 0.005 (0.01 with `summary=1`) | main content of a web page as clean Markdown |
| `GET /company/{domain}` | 0.02 | company profile from its website: name, industry, products, location, public contact pages, tech |
| `GET /pdf-markdown?url=` | 0.03 | text-based PDF (up to 20 pages, 20 MB) converted to clean Markdown with headings, lists and tables |
| `GET /audit/{domain}` | 0.05 | AI security audit: 0-100 score, findings by severity, exact DNS and header fixes |

Call without payment to get the `402 Payment Required` challenge:

```bash
curl -i https://ipv4.fr/x402/v1/dns/example.com
```

### Node client

[`examples/x402-client.mjs`](examples/x402-client.mjs) pays automatically with the official [`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch) client. The wallet needs a little USDC on Base; gas is paid by the facilitator.

```bash
cd examples
npm install
EVM_PRIVATE_KEY=0xYOUR_KEY node x402-client.mjs dns example.com
EVM_PRIVATE_KEY=0xYOUR_KEY node x402-client.mjs audit example.com
EVM_PRIVATE_KEY=0xYOUR_KEY node x402-client.mjs markdown https://example.com
```

Use a dedicated wallet with a small balance for agents. Never commit your private key.

## REST API

Base URL `https://ipv4.fr/api/v1`. Send your key in the `X-Api-Key` header. Get a free key:

```bash
curl -X POST https://ipv4.fr/api/v1/register \
  -H "Content-Type: application/json" -d '{"email":"you@example.com"}'
```

Examples:

```bash
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/dns/example.com
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/ssl/example.com
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/whois/example.com
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/email/user@example.com
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/blacklist/203.0.113.7
curl -H "X-Api-Key: $KEY" https://ipv4.fr/api/v1/subnet/192.168.1.0/24
curl -H "X-Api-Key: $KEY" "https://ipv4.fr/api/v1/headers?url=https://example.com"
curl https://ipv4.fr/api/v1/my-ip
```

Plans: Free (25 requests/day), Credit Pack (5,000 requests, one-time), Pro and Business (monthly, bulk endpoints, uptime monitors). Paid in BTC, ETH, USDC or Telegram Stars. Details on [ipv4.fr/pricing](https://ipv4.fr/pricing), full reference in the [docs](https://ipv4.fr/docs.html).

## MCP server

Remote server over Streamable HTTP: `https://ipv4.fr/mcp`, listed in the official MCP registry as [`fr.ipv4/network-tools`](https://registry.modelcontextprotocol.io/v0/servers?search=fr.ipv4).

Tools: `dns_lookup`, `whois`, `ssl_check`, `ip_geolocation`, `email_validate`, `ip_blacklist`, `http_headers`, `subnet_calc`, `domain_audit` (paid key required). 20 free calls per day per IP; add an `X-Api-Key` header for your plan's limits.

Claude Code:

```bash
claude mcp add --transport http ipv4 https://ipv4.fr/mcp
# with an API key
claude mcp add --transport http ipv4 https://ipv4.fr/mcp --header "X-Api-Key: YOUR_KEY"
```

Cursor (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "ipv4": {
      "url": "https://ipv4.fr/mcp",
      "headers": { "X-Api-Key": "YOUR_KEY" }
    }
  }
}
```

Claude Desktop: add `https://ipv4.fr/mcp` under Settings, Connectors, Add custom connector. Or, in `claude_desktop_config.json`, through the `mcp-remote` bridge:

```json
{
  "mcpServers": {
    "ipv4": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://ipv4.fr/mcp"]
    }
  }
}
```

The `headers` entry and `--header` flag are optional; leave them out to use the free tier.

## Free web tools

Browser versions of the tools, no signup: [ipv4.fr/tools](https://ipv4.fr/tools). Crypto price alerts on Telegram: [@Ipv4_crypto_bot](https://t.me/Ipv4_crypto_bot).

## Contact

contact@ipv4.fr

## License

MIT for the code in this repository. Use of the ipv4.fr service is subject to its pricing and fair use limits.
