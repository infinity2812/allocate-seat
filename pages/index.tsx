import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { useRef, useState } from 'react';

// Import the actual Paystream types and constants (same as allocateSeat.ts)
import {
    SOL_MARKET,
    SOL_MINT,
    USDC_MARKET,
    USDC_MINT,
} from "@meimfhd/paystream-v1";

export default function SeatAllocator() {
  const [adminWallet, setAdminWallet] = useState<Keypair | null>(null);
  const [address, setAddress] = useState('');
  const [usdcSelected, setUsdcSelected] = useState(true);
  const [solSelected, setSolSelected] = useState(true);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RPC URL from environment (no hardcoded default)
  const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL ?? '';

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev: string[]) => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleWalletUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const walletData = JSON.parse(e.target?.result as string);
          const keypair = Keypair.fromSecretKey(new Uint8Array(walletData));
          setAdminWallet(keypair);
          setStatus(`Admin wallet loaded: ${keypair.publicKey.toString()}`);
          addLog(`Admin wallet loaded: ${keypair.publicKey.toString()}`);
        } catch (error) {
          setStatus('Invalid wallet file format');
          console.error('Error loading wallet:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const allocateSeat = async () => {
    if (!adminWallet) {
      setStatus('Please load an admin wallet first');
      return;
    }

    if (!usdcSelected && !solSelected) {
      setStatus('Please select at least one market');
      return;
    }

    setIsLoading(true);
    setStatus('Allocating seats... This may take a few moments.');
    
    try {
      const connection = new Connection(RPC_URL, 'confirmed');
      addLog('🚀 Starting seat allocation process...');
      addLog(`Target address: ${address}`);
      addLog(`Admin wallet: ${adminWallet.publicKey.toString()}`);

      // Import the actual Paystream program from SDK root
      const { PaystreamV1Program } = await import('@meimfhd/paystream-v1');
      // Import Admin client from built output (not exported at package root in current npm version)
      const { PaystreamV1AdminClient } = await import(
        '@meimfhd/paystream-v1/dist/clients/paystream-admin-client.js'
      );

      // Create proper Anchor provider using a minimal wallet wrapper around the uploaded Keypair
      const { AnchorProvider } = await import('@coral-xyz/anchor');
      const browserWallet: any = {
        publicKey: adminWallet.publicKey,
        payer: adminWallet,
        signTransaction: async (tx: any) => {
          // Partial sign with the admin keypair (legacy Transaction)
          if (typeof tx.partialSign === 'function') {
            tx.partialSign(adminWallet);
            return tx;
          }
          // For VersionedTransaction
          if (typeof tx.sign === 'function') {
            tx.sign([adminWallet]);
            return tx;
          }
          throw new Error('Unsupported transaction type for signing');
        },
        signAllTransactions: async (txs: any[]) => {
          for (const tx of txs) {
            if (typeof tx.partialSign === 'function') {
              tx.partialSign(adminWallet);
            } else if (typeof tx.sign === 'function') {
              tx.sign([adminWallet]);
            } else {
              throw new Error('Unsupported transaction type for signing');
            }
          }
          return txs;
        },
      };

      const provider = new AnchorProvider(connection, browserWallet, {
        commitment: 'confirmed',
      });

      const program = new PaystreamV1Program(provider);
      const adminClient = new PaystreamV1AdminClient(provider);

      const allocateePubkey = new PublicKey(address);
      const instructions = [];

      // Create instructions using the actual SDK (same as your script)
      if (usdcSelected) {
        addLog('📝 Creating USDC market instruction...');
        const usdcInstruction = await adminClient.allocateSeatIx(
          USDC_MARKET,
          USDC_MINT,
          allocateePubkey
        );
        instructions.push(usdcInstruction);
      }

      if (solSelected) {
        addLog('📝 Creating SOL market instruction...');
        const solInstruction = await adminClient.allocateSeatIx(
          SOL_MARKET,
          SOL_MINT,
          allocateePubkey
        );
        instructions.push(solInstruction);
      }

      addLog(`✅ Created ${instructions.length} instructions`);

      // Execute the transaction using the program (same as your script)
      addLog('📡 Executing transaction...');
      const signature = await program.rpc(instructions);
      
      addLog('🎉 Transaction successful!');
      addLog(`🔗 Signature: ${signature}`);
      addLog(`🔗 View on Solana Explorer: https://explorer.solana.com/tx/${signature}`);
      
      setStatus('Seats allocated successfully! 🎉');
      
    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setStatus(`Error: ${error.message}`);
      console.error('Allocation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎯 Paystream Seat Allocator</h1>
          <p className="text-xl opacity-90">Allocate seats using the real Paystream SDK</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <div className="mb-4 p-4 bg-white/10 rounded-lg">
            <strong>Admin Wallet:</strong> 
            <span className="ml-2 font-mono text-sm break-all">
              {adminWallet ? adminWallet.publicKey.toString() : 'Not loaded'}
            </span>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Address to Allocate Seat:
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/90 text-gray-800"
              placeholder="Enter Solana address"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Markets to Allocate:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={usdcSelected}
                  onChange={(e) => setUsdcSelected(e.target.checked)}
                  className="mr-2"
                />
                USDC Market
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={solSelected}
                  onChange={(e) => setSolSelected(e.target.checked)}
                  className="mr-2"
                />
                SOL Market
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Admin Wallet File (JSON):
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleWalletUpload}
              accept=".json"
              className="w-full p-3 rounded-lg bg-white/90 text-gray-800"
            />
          </div>

          <button
            onClick={allocateSeat}
            disabled={isLoading || !adminWallet}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-red-600 hover:to-orange-600 transition-all"
          >
            {isLoading ? '🔄 Allocating...' : '🚀 Allocate Seat'}
          </button>

          {status && (
            <div className="mt-4 p-4 bg-white/20 rounded-lg text-center">
              {status}
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4">Transaction Logs</h3>
          <div className="bg-black/40 p-4 rounded-lg font-mono text-sm max-h-80 overflow-y-auto">
            {logs.length === 0 ? 'Ready to allocate seats...' : logs.join('\n')}
          </div>
        </div>

        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 text-center">
          <strong>⚠️ Important:</strong> This tool uses the real Paystream SDK to allocate seats. 
          Ensure you have the correct admin wallet loaded and sufficient SOL for transaction fees.
        </div>
      </div>
    </div>
  );
}
