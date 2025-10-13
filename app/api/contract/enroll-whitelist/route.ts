import { NextRequest, NextResponse } from "next/server";
import { publicKeyToAddress, principalCV } from "@stacks/transactions";
import {
  signContractCallWithTurnkey,
  broadcastContractCall,
  CONTRACTS,
} from "@/app/lib/stacks-utils";

export async function POST(req: NextRequest) {
  try {
    // Server wallet signs for all users (hackathon workaround)
    // Note: This means all enrollments come from the same address

    const transaction = await signContractCallWithTurnkey({
      contractAddress: CONTRACTS.BTCUNI_MAIN,
      contractName: "btcuni",
      functionName: "enroll-whitelist",
      functionArgs: [], // No arguments needed
    });

    const txId = await broadcastContractCall(transaction);

    return NextResponse.json({
      success: true,
      txId,
      message: "Successfully enrolled in whitelist",
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Whitelist enrollment failed:", error);
    return NextResponse.json(
      { error: error.message || "Whitelist enrollment failed" },
      { status: 500 }
    );
  }
}
