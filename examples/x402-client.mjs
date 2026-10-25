// Pay-per-call client for the ipv4.fr x402 endpoints (USDC on Base).
// Usage: EVM_PRIVATE_KEY=0x... node x402-client.mjs dns example.com
// The wallet needs a little USDC on Base. No ETH is needed: the facilitator pays gas.
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const BASE = "https://ipv4.fr/x402/v1";

const ROUTES = {
  dns: (q) => `/dns/${encodeURIComponent(q)}`,
  whois: (q) => `/whois/${encodeURIComponent(q)}`,
  ssl: (q) => `/ssl/${encodeURIComponent(q)}`,
  email: (q) => `/email/${encodeURIComponent(q)}`,
  geo: (q) => `/geo/${encodeURIComponent(q)}`,
  blacklist: (q) => `/blacklist/${encodeURIComponent(q)}`,
  headers: (q) => `/headers?url=${encodeURIComponent(q)}`,
  audit: (q) => `/audit/${encodeURIComponent(q)}`,
  markdown: (q) => `/markdown?url=${encodeURIComponent(q)}`,
  company: (q) => `/company/${encodeURIComponent(q)}`,
  pdf: (q) => `/pdf-markdown?url=${encodeURIComponent(q)}`,
};

const [tool, query] = process.argv.slice(2);
if (!ROUTES[tool] || !query) {
  console.error(`Usage: node x402-client.mjs <${Object.keys(ROUTES).join("|")}> <query>`);
  process.exit(1);
}
if (!process.env.EVM_PRIVATE_KEY) {
  console.error("Set EVM_PRIVATE_KEY to the private key of a wallet holding USDC on Base.");
  process.exit(1);
}

const account = privateKeyToAccount(process.env.EVM_PRIVATE_KEY);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment(BASE + ROUTES[tool](query));
if (res.status === 402) {
  const required = res.headers.get("PAYMENT-REQUIRED");
  const reason = required ? JSON.parse(Buffer.from(required, "base64").toString()).error : "payment refused";
  console.error("Payment failed:", reason);
  process.exit(1);
}
const receipt = res.headers.get("PAYMENT-RESPONSE");
if (receipt) console.error("Payment:", decodePaymentResponseHeader(receipt));
console.log(res.status, JSON.stringify(await res.json(), null, 2));
