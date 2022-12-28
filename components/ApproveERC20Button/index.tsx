import {Button} from "@chakra-ui/react";
import {erc20ABI} from '@wagmi/core'
import {useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction} from "wagmi";
import {BigNumber} from "ethers";
import {MaxUint256} from "@ethersproject/constants";

const ApproveERC20Button = (props: any) => {
  const {token, owner, spender, spendAmount} = props
  const tokenContract = {
    address: token,
    abi: erc20ABI
  }
  const {data: allowanceData} = useContractRead({
    ...tokenContract,
    functionName: 'allowance',
    args: [owner, spender],
    cacheTime: 3_000,
  })
  const {config} = usePrepareContractWrite({
    ...tokenContract,
    functionName: 'approve',
    args: [spender, MaxUint256]
  })
  const {write: approve, status: approveStatus} = useContractWrite(config)

  return (
    <>
      {
        BigNumber.from(allowanceData || 0).lt(BigNumber.from(spendAmount)) && (
          <Button onClick={() => approve?.()} w={'full'} isLoading={approveStatus === 'loading'} loadingText={"Approving..."}>
            Approve {approveStatus === 'success' && "Success"} {approveStatus === 'error' && "Error"}
          </Button>
        )
      }
    </>
  )
}

export default ApproveERC20Button