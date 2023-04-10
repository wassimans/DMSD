import { useDmsdApp } from "@/contexts/DmsdContext";
import {
  useDmsdGetUser,
  useDmsdGetUserAtIndex,
  useDmsdRead,
} from "@/generated";
import { BigNumber } from "ethers";
import { signOut, useSession } from "next-auth/react";
import { useAccount } from "wagmi";

export default function Home() {
  const {
    state: { contractAddress },
  } = useDmsdApp();
  const { address } = useAccount();

  const { data } = useDmsdGetUser({
    address: contractAddress,
    args: [address!],
  });

  console.log(data);

  return (
    <>
      <div>{data?.[0]}</div>
      <div>{data?.[1]}</div>
      <div>{data?.[2]}</div>
      <div>{data?.[3]}</div>
      <div>{data?.[4]}</div>
    </>
  );
}
function useDmsdGetAtIndex(arg0: { address: any; args: number[] }): {
  data: any;
} {
  throw new Error("Function not implemented.");
}
