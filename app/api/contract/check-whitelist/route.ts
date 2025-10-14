import { NextRequest, NextResponse } from "next/server";
import {
  hexToCV,
  cvToValue,
  principalCV,
  serializeCV,
  ClarityType,
} from "@stacks/transactions";

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    console.log("Checking whitelist for address:", address);

    if (!address) {
      console.log("No address provided");
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Build the argument (principal address)
    const principalArg = principalCV(address);
    const serializedArg = `0x${Buffer.from(serializeCV(principalArg)).toString(
      "hex"
    )}`;
    console.log("Serialized argument:", serializedArg);

    // Call read-only function to check whitelist status
    const contractAddress = process.env.NEXT_PUBLIC_BTCUNI_CONTRACT_ADDRESS!;
    const contractName = process.env.NEXT_PUBLIC_BTCUNI_CONTRACT_NAME!;
    const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
    const apiUrl =
      network === "mainnet"
        ? "https://api.hiro.so"
        : "https://api.testnet.hiro.so";

    console.log("Calling Hiro API...");
    const response = await fetch(
      `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/is-whitelisted-beta`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: address,
          arguments: [serializedArg],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hiro API error:", errorText);
      console.log("Returning false due to API error");
      // Don't throw, just return not whitelisted
      return NextResponse.json({
        success: true,
        isWhitelisted: false,
      });
    }

    const data = await response.json();
    console.log("API response data:", JSON.stringify(data, null, 2));

    // Parse the Clarity hex result
    // The contract returns:
    // - (ok true) if user is whitelisted
    // - (err u102) if user is NOT whitelisted
    const clarityValue = hexToCV(data.result);
    console.log("Clarity value type:", clarityValue.type);

    let isWhitelisted = false;

    // Check if it's a ResponseOk type
    if (clarityValue.type === ClarityType.ResponseOk) {
      console.log("Response is OK (checking inner value)");
      const parsedValue = cvToValue(clarityValue);
      console.log("Parsed value:", JSON.stringify(parsedValue, null, 2));

      // The inner value should be a boolean true (not a uint)
      // Contract returns (ok bool), so check if value === true
      if (
        parsedValue &&
        typeof parsedValue === "object" &&
        "value" in parsedValue
      ) {
        isWhitelisted = parsedValue.value === true;
      }
    } else if (clarityValue.type === ClarityType.ResponseErr) {
      console.log("Response is error (not whitelisted - err u102)");
      isWhitelisted = false;
    }

    console.log("Final is whitelisted:", isWhitelisted);

    return NextResponse.json({
      success: true,
      isWhitelisted,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Whitelist check failed:", error);
    console.log("Returning false due to error");
    // Return false instead of error for better UX
    return NextResponse.json({
      success: true,
      isWhitelisted: false,
    });
  }
}
