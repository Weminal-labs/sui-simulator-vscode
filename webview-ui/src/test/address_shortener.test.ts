import { shortenObjectType } from "../utils/address_shortener";

console.log(
  shortenObjectType(
    "0x2::coin::TreasuryCap<0x591ecf3652d27ad995c1f16165d2551ee70592097fa4e134723977db04671256::tdtc::TDTC>",
    5
  )
);

console.log(
  shortenObjectType(
    "0x591ecf3652d27ad995c1f16165d2551ee70592097fa4e134723977db04671256::tdtc::TDTC",
    5
  )
);
