/** The network a build runs on. Status colours only: testnet is test money, mainnet is real money. */
export default function NetworkBadge({ network, chain }) {
  const label = network === 'testnet' ? 'Testnet' : network === 'mainnet' ? 'Mainnet · real funds' : 'No chain';
  return (
    <span className={`bowl-network bowl-network--${network}`}>
      {label}
      {chain && network !== 'none' ? ` · ${chain}` : ''}
    </span>
  );
}
