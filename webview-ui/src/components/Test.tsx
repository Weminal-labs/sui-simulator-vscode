import React from 'react'
import { requestDataFromTerminal } from '../utils/wv_communicate_ext';
import { SuiCommand } from '../../../src/enums';
import { useMySuiAccount } from '../context/MySuiAccountProvider';

const TestComponent = () => {
  const { getTotalGas } = useMySuiAccount();

    const testButton =async ()=>{
        console.log("Test button")
        const resp = await requestDataFromTerminal({
            cmd: SuiCommand.SPLIT_COIN,
            objectId:"0xca6e64c5cacfe74ac80cc0e7df2253b82f9dd5b2e4f15c758b1a3511e74db887",
            type:"count",
            amount:"2",
            rpc:"https://fullnode.testnet.sui.io:443",
            alias:"Hinet",
            // primaryCoin: "0xa61187a94e5391fbb039d750409c1c13d6a04b52b5e4cfe2678463f11f09b83c",
            // mergedCoin: "0x69c17fe79771054be587b22fd2e348cf745cad4781b806c409d0ef6375bd9096",
            budget:"10000000",
           
          });
        let sum = await getTotalGas();
        console.log(sum)
    }
    return (
    <button className='absolute bg-blue-500 text-white font-bold py-2 px-4 rounded top-[10px] left-[10px]' onClick={()=>testButton()}>
        Test
    </button>
  )
}

export default TestComponent
