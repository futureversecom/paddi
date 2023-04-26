// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";

/**
 * A mock implementation of the ASM Gen II Brain ERC721 contract.
 * This contract allows unlimited minting by any caller.
 */
contract MockBrain is ERC721AQueryable {
  string private constant baseURI = "https://meta.gen-ii-brains.alteredstatemachine.xyz/ipfs/";

  constructor() ERC721A("ASMBrainGenII", "ASMBrainGenII") {}

  function faucet() external {
    _mint(msg.sender, 1);
  }

  function faucetTo(address to) external {
    _mint(to, 1);
  }

  /**
   * Get tokenURI for Brain tokenId
   * @param tokenId The token ID
   * @return uri The tokenURL as a string
   */
  function tokenURI(uint256 tokenId) public view override (IERC721A, ERC721A) returns (string memory uri) {
    return string.concat(baseURI, cidv0Hashes[tokenId % 100]);
  }

  // Copy of the first 100 cidv0 hashes of Gen II Brains
  string[] public cidv0Hashes = [
    "QmaakG6REBqYB7BieQC54RtkarXy5ePb8TyyK1ahJprPkt",
    "Qmc32uFGqee9hFa5BwWMwNyLhXqS46cdAr5Ch4ihgVGn9b",
    "QmdQK6v5rFX86LQPBDDF75HUigBZjM8D2eZbGUazz9hUuG",
    "Qmcyqp2EEGmdFxnwx68iVLfcT9ZtFNRZHxab2B9khS9bKk",
    "QmU2youSF3E7SFzbyV5NitDFMQyxYFKAgXs55SeeHew7YD",
    "QmaUL2LTQwWdYmAFHApchobp5MR1K1bEEKsDtemwCa7PjS",
    "QmeVtJ7JyCW2uBYNMXKwa7gLzcgq6JEbsyaUGUaJ9riEjY",
    "QmZqRrgK31JySSaPq2xGbkxbGaPWADkVXwEqjjjGk7UHoS",
    "QmXaaUu8bNAZMdwA343MahaUDCjVDvLkeqaeUHxJir5B5M",
    "Qme8zwWM7181F2ML7V9wk1Hi7SFuuGa3EeLLNuZHjRAByK",
    "QmRg6Xwu7sK1rD32Xh8dmCFdyAndSiMSaXzNcgafiAfxwg",
    "QmesmVBMKSnchcghiUdDXokmfoi4Evrb2EUwoGuHpa6zLT",
    "QmX31hE98KJW7u2Mj22GYrsQC6VRd8bEA6uVDEjnzSGnQY",
    "QmSzN3Fpwc1Y3PjTH1hJjcSqCDzG81RbkiXG6W5ubxdcYD",
    "QmPM62Fety1doisq3TK3sZwY3C725ZKi5K6m9WLyrRWoiy",
    "QmTG1MnLhnQeXgjM1NRKfSx8HJrCSG3rwWWQrcfNzej6V6",
    "QmamZ6X4i9ToyD9eTKCC8mdvSVYAqtZxo8pTdFTMhhh4NQ",
    "QmRWcv7v3rcAzydE8KbNagHcc9yuhSDTdL1k6g5oY8eDBz",
    "QmYDkhKyRxCbBkbG91uaVQ18RWzELfjwktTG7uHH5JwYDk",
    "QmYbJdQcECMa7kKi3n4XLw1ZZS39gt7yn3ZjD8c6dDXKpq",
    "Qmc93fULeQj7VhP51hCjzcTYmSaR1337yAbX6h5FDMFrpd",
    "QmYsgvFe9CvNmueWTtCV5WHfHRErNa23BosovohaXSuEnh",
    "QmSHg6AGoWoxScYb2VE2S3i4QMu3qMhuurNyCT4sThLmss",
    "QmXQiVP4QHNfRENU2dYPyz4pyqfosC67aPJW7n43T5wTAG",
    "QmQUsh7neRB6cC5HmHnBhhQjSiS3d9DrHQNTYo6K5hadNv",
    "QmRyuyhGfRMtorxg3Vu9qnFq2yZLqJ5uhiYTQ1HjTmD5wN",
    "QmQQo4a3asCwZV2kJdMML5z3QiUproy6a8yN7iKqMmZTxu",
    "QmVRK2ksemTVkTUwX2ddJuA4M6eunVSh4YS1yzyyBmUpKF",
    "QmVobj3MzdVBGyX2gHv9cdg6r7AWTmBWs5R6hxKEpi9avU",
    "QmauoKnmZUWxYV5DqbRwRFuLJDKXwRrEsWbxkK4k4JBuBK",
    "QmPfKbsoSHW6jqZh4C86vMDtduXbisi8Ppq354Q3SrffzA",
    "QmTq4JMMysrZXZxVY3C8pjMTL1HYGFwXg1dcqsV1ar6yjK",
    "QmV6WsBEuSrttved4CrR7hCmSi6Juo4iJqP8q1n7bdfmc9",
    "QmaeFM2uJByX8nZtj31aqoMjW9kmxRcqSQ8oEjERFbeVZV",
    "QmTdrHhM452dmWSywZ8devNZf7PyYFPYTBKTbDg5daM6Ri",
    "QmaxtFcocDMw2Je83ZepEnJz6sVn2xEDBpQqurXovQu7th",
    "QmXgE721M3UPmvFPGSTXJCFjMQG9A4UDUcQL7cUKQhN4fh",
    "QmXsakaeCvhrYkmQnX1PfUXfMvMaPpMoEFgN5kg7nGATmW",
    "QmVE2sZ2PPH3A36Di9mx5pcymhi4q6eV9u47ACZbtZPBVY",
    "QmeFJcxZo4ikJoyXqqzqFvAJXiEVeaY4unmy1awmf1DCRm",
    "QmZDriYZLG5ML5Ce7XrnCPGHwaSTKPcYqsbf5PLwsTeoxL",
    "QmYvvqmoJiQMGnQhhETC952sFWhq7G8AXs9Q8bqVusjMPL",
    "QmWG8M8LGw2rMCXFLguemxNevkVs8ckivGYwtpA987cTyF",
    "QmYNg2WGsqHzkZsoNJ8cSNoHK1ywMDJgPJaWXjVivWBArR",
    "QmYfiuZvYcqKsGoynAarCp1Gm5pcWaYA8wszdibCZJi12L",
    "QmXgx3XGqvoBkqqHySALMpLjF18D3x3CuAUo59gj8zq9Jj",
    "QmaAEZgHrqe4WoU8wXqrh5o1HSrDcpuF5WMjPT4sqPSMi9",
    "QmadySP1Yd1ZfH6qnwRBnNaveZCHPcSoWJeHNLAxmRimdr",
    "Qmcy4rfHfTJXrreyTh4GRPSy5QF1ZJeJvNbqaWz9j35D91",
    "QmRMTi7cihVmnaWUi1ZAoCGgV6eu1dbbjJJHvzjSaN7aFL",
    "QmYG5QyZW4X5Fwfshx5bvhPtoyX9U3UTtv1dX2nZ7UX9EM",
    "QmWfubRWwfUHHaWhMBy7rudnXTpxrofumqicoRR9UBAXsP",
    "QmbSLq9uDT3TVAV3VgGpshmtZpYJ3NxsPm6oznJbxa57xq",
    "QmXD6eQ4tNumqBE8PGFH9L8gibUTdYjL9v3SUrVHEtP6Xi",
    "QmahhHkuncU6rsFMQ4pyQvjUUx3aDdQYFkcR4ukjcBPh56",
    "QmaSTFAqucX8q4E9HHdtBErY68fNu8gVExoUbBbjKHLNmM",
    "QmXD9jheYgvvKDXLZGYoqztJEVfrQ7yB6NSKaQKmESLo4p",
    "QmYRRExRfc3g5tATrYPJ45aRn8JLJ6T8959YsvTPjjhEUr",
    "QmUgBQdKb1oYupP2Fs4eXk6eTqQyQ9cLBEF5VTaAAfr2bC",
    "QmXqvdJNK6a2n55UaJM6uvfyQeJLdev8DFP2nydjSTK1Qz",
    "QmZtL97WEoHA2HKLSzZ74y9MfM9nmFWsiMqiRyweqL8ikX",
    "QmZoLMUL3NS4PyBHFgzk1ruKA19dCcgWSX3F7ArGc6UB5b",
    "Qman9DuHyA6j7TvUczGBm3NU2jxtd6j89bm7aXWspagjE8",
    "QmeQcpRiMbYzapB4vAtH3tFt4PdEd6Zb7p7r1Y2M9KstQw",
    "QmegvaBeMM4E4kV8Gqn2T9d6tqkz4RUF324PC2jNgAAVKV",
    "QmbKPJxdj71acXfCjikvS9Qwfmyk6F1SVky4WPhSjD4gSz",
    "QmRBEQFobbjiGxZ8GgU8oEz3DX9eNK69zEgmCNTWJcaR6H",
    "QmWfN5kJJjhS4siKaqw7adr917RzvKE5Jj7YdY4DiFYYex",
    "QmcuFTBN3U3q6su5GfRMixHu5tZ7Aa9eewyMYfNRENm2nA",
    "QmanDiR24zLithSsVGdG3LPbt9GtLceMBiDRUt1L9HhqYK",
    "QmR44Er25Qndn5wp9cfiracwpaeYroFVN1f2WijLz1dBen",
    "QmdqdURNdR1ZkNsMnyDAaZHoZPW7hcNm8JnNXCGPC22ZWk",
    "QmTPqrwL9m6f7nvnfDMH6wPRb3MSuERXgs94ZbxhCU1Hpj",
    "QmY4yxLhkdkYQSJxBmNUf2zUYkmcd1qrcXHAXk4W4zDby8",
    "QmTMR6khxB7TuHS5upKBWJaLvgEASpQ3t8Q4bNXTENMhuJ",
    "QmQU3GTx9H1Bx38nkREoymtUfiM1DDnBZxEPvG3DhbZNPL",
    "QmVNoG1R1mFHtdWNPpaPyrB6Uf2uDrCG8dNgqGjMoVNgQu",
    "QmUnvS2iuaYjYJVr9VJyT4dk2eZdLuzuAbCY5DPhVpufo8",
    "QmRNZAHKSXpm434iXGuECKVYUhBPrirztV78k89UrHKPQk",
    "QmQnfwZLw9StHb4nC9tv5Rt7d3MYtztjiv2JAy6LUXASf3",
    "QmWHTeGBBF5idg7LCGNPxnjz2WNMgtDo2zujCekP1cP3eV",
    "QmenT8GeR2qyv5d5Q4jKYrQjvB17jVaDBmssEPA6Rs5wCT",
    "QmakqNNpHuEaDMUunmVQQq59yxsVoyY9GCmky1wiP36chG",
    "QmYopRbhZNbVTrYyrHVAopq6iPw9ukQ6VFmdEKAXqFh9yS",
    "QmQqH415XTdJGgT9bJvM8or8ctmGoBXdvTK8FGjSxkjfsu",
    "QmdHmytTx2vNynNL2hj6w8dnBu1L1igWt9tzHSDG4RkdpZ",
    "QmZYTKWh9KM8VXYRB9rdZGkdrTgb5PQws9u1FxBU1xkzmW",
    "QmQNFQEG6G9Qfo2uUpXbwUWiXrxRSEAi4mAepUgMW7YS42",
    "QmdyBDFH8UFmt3xumPbtiw6LnULDXwf6ro6qRZEeAvrkqU",
    "QmNq7JjMMFi6TmwRt2T6XWW9FyJ85eTJUTCmbjzQ8zsCaA",
    "QmVUDDiVGwriTqFe9JWmGkTCQU1QyEro8tqUF7jN9tV2AR",
    "QmUFLFEihCrg3Gnu8FPPiCtX9mxe9bbCrXejt5HoRLE97N",
    "QmPKhVjtFBwtXCHa8qMVjKjXzi1xaBzRpgzJ1vcatD64pr",
    "QmYMB67qxe8GRhdMbjG94Cu6rpuVfce1rkZMVKLwyEdDTZ",
    "QmNXwh5AoKrCn9CDn84ebLBYTgFR1hhwpiXcgF59pcPbT4",
    "QmexRs9zvX1RPCKYQeg8eHwFHS2U5qfsUiMvrJA95CNEyf",
    "QmQxctpdWUViL3yf87T1KLp7GqSdv9QJ9FyyE6faRp5rey",
    "QmPVSeLDX9egozeX5nZQR1QVAAoxSbzyq7WuRJ2gtJdngv",
    "QmduBxnhv27mApKEkut8uhEZfBMRQnWmnE3nRQc8km4Vs1",
    "QmadTxyDXootYpAGFkjZLNkEr7DmKvJ8boJwvgdycj8trb"
  ];
}
