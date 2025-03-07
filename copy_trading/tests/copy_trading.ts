import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CopyTrading } from "../target/types/copy_trading";
import { expect } from "chai";

describe("copy_trading", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.CopyTrading as Program<CopyTrading>;
  
  it("Can add a trader", async () => {
    const traderWallet = anchor.web3.Keypair.generate();
    
    // Find PDA for trader profile
    const [traderProfile, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("trader"), traderWallet.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .addTrader("Test Trader")
        .accounts({
          traderProfile,
          traderWallet: traderWallet.publicKey,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      // Fetch the trader profile
      const profile = await program.account.traderProfile.fetch(traderProfile);
      
      expect(profile.name).to.equal("Test Trader");
      expect(profile.walletAddress.toString()).to.equal(traderWallet.publicKey.toString());
      expect(profile.roi.toNumber()).to.equal(0);
      expect(profile.isVerified).to.equal(false);
      
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  });
});