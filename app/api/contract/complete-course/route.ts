import { NextRequest, NextResponse } from "next/server";
import { publicKeyToAddress, uintCV, principalCV } from "@stacks/transactions";
import {
  signContractCallWithTurnkey,
  broadcastContractCall,
  CONTRACTS,
} from "@/app/lib/stacks-utils";

export async function POST(req: NextRequest) {
  try {
    const { pubKey, courseId, studentAddress } = await req.json();

    if (!pubKey || courseId === undefined || !studentAddress) {
      return NextResponse.json(
        { error: "Public key, course ID, and student address are required" },
        { status: 400 }
      );
    }

    // Derive Stacks address from public key (must be instructor or owner)
    const senderAddress = publicKeyToAddress(pubKey, "testnet");

    // Call complete-course function
    const transaction = await signContractCallWithTurnkey({
      contractAddress: CONTRACTS.BTCUNI_MAIN,
      contractName: "btcuni",
      functionName: "complete-course",
      functionArgs: [uintCV(courseId), principalCV(studentAddress)],
    });

    const txId = await broadcastContractCall(transaction);

    return NextResponse.json({
      success: true,
      txId,
      message: `Successfully marked course ${courseId} as complete for student`,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Course completion failed:", error);
    return NextResponse.json(
      { error: error.message || "Course completion failed" },
      { status: 500 }
    );
  }
}
