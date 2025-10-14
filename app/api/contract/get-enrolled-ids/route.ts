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

    console.log("=== GET ENROLLED IDS ===");
    console.log("Address:", address);

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const contractAddress = process.env.NEXT_PUBLIC_BTCUNI_CONTRACT_ADDRESS!;
    const contractName = process.env.NEXT_PUBLIC_BTCUNI_CONTRACT_NAME!;
    const network = process.env.NEXT_PUBLIC_STACKS_NETWORK || "testnet";
    const apiUrl =
      network === "mainnet"
        ? "https://api.hiro.so"
        : "https://api.testnet.hiro.so";

    // Build the argument (principal address)
    const principalArg = principalCV(address);
    const serializedPrincipal = `0x${Buffer.from(
      serializeCV(principalArg)
    ).toString("hex")}`;

    console.log("Serialized principal:", serializedPrincipal);

    // Call read-only function to get enrolled course IDs
    const apiEndpoint = `${apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/get-enrolled-ids`;
    console.log("Calling API:", apiEndpoint);

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: address,
        arguments: [serializedPrincipal],
      }),
    });

    console.log("API response status:", response.status);

    if (!response.ok) {
      console.error("Hiro API error - response not ok");
      return NextResponse.json({
        success: true,
        enrolledIds: [],
      });
    }

    const data = await response.json();
    console.log("API response data:", JSON.stringify(data, null, 2));

    // Parse the Clarity response
    const clarityValue = hexToCV(data.result);
    console.log("Clarity value type:", clarityValue.type);

    let enrolledIds: number[] = [];

    // Check if it's a ResponseOk type
    if (clarityValue.type === ClarityType.ResponseOk) {
      console.log("Response is OK");
      const parsedValue = cvToValue(clarityValue);
      console.log("Parsed value:", JSON.stringify(parsedValue, null, 2));

      // The inner value should be a list of uints
      if (
        parsedValue &&
        typeof parsedValue === "object" &&
        "value" in parsedValue
      ) {
        const courseList = parsedValue.value;
        if (Array.isArray(courseList)) {
          enrolledIds = courseList.map((item: any) => {
            // Each item is an object with type and value properties
            if (typeof item === "object" && "value" in item) {
              return Number(item.value);
            }
            // Fallback for direct number/bigint values
            return Number(item);
          });
          console.log("Enrolled course IDs:", enrolledIds);
        }
      }
    } else {
      console.log("Unexpected response type or error");
    }

    console.log("Final enrolled IDs:", enrolledIds);
    console.log("=== END GET ENROLLED IDS ===\n");

    return NextResponse.json({
      success: true,
      enrolledIds,
    });
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Get enrolled IDs failed:", error);
    return NextResponse.json({
      success: true,
      enrolledIds: [],
    });
  }
}
