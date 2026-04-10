# Implementation Notes

## What I Changed
- Added `getHousePercent(uint8 markedCount)` internal function to `EthexLoto.sol` 
  that returns a dynamic house edge (1 cell → 12%, 2–3 cells → 10%, 4–6 cells → 8%),
  replacing the previously hardcoded flat 10% fee
- Reordered logic in `placeBet()` to decode the bet and compute `markedCount` first,
  before applying the house fee, then passed the correct net `betAmount` into `getHold()`
  for accurate hold and coefficient calculation

## Why the Change is Safe
- No public interfaces were modified — `placeBet()` signature is unchanged
- `JACKPOT_PERCENT` and all jackpot registration/settlement logic is completely untouched
- `getHold()` is unchanged — only the amount passed into it differs, which is the correct
  intended behavior
- Dynamic fee is applied consistently everywhere `betAmount` is used, including refunds,
  since `bet.amount` stored in the queue is always the post-deduction net amount

## Edge Cases Considered
- Zero marked cells: rejected via `require(markedCount > 0, "No marked cells")`
- Refund consistency: expired bets refund `bet.amount` which already reflects the correct
  dynamic fee deduction at the time of placing, so no special refund logic was needed
- Integer truncation: Solidity division truncates — fee calculations follow the same
  pattern as the existing `jackpotFee` calculation to stay consistent

---

## Additional Observations

> The following are outside the scope of the task and were not modified.
> Included for transparency and completeness.

### Architecture Concerns and Security Risks
- `tx.origin` is used for authentication (`require(tx.origin == msg.sender)`). This is
  discouraged as it breaks composability and can introduce phishing-style vulnerabilities.
  `msg.sender` alone is the safer standard practice
- Bet acceptance depends on live contract balance (`address(this).balance - holdBalance`),
  creating a liquidity dependency where large bets may be rejected unpredictably depending
  on current pool state

### Test Environment Setup
- A Ganache v7+ / WSL hardfork compatibility issue required a configuration fix.
  `gasPrice: 20000000000` (20 gwei) was added to `truffle-config.js` to satisfy
  EIP-1559's `maxFeePerGas >= baseFeePerGas` requirement — see the note at the
  top of `truffle-config.js` for full details
- Candidate suite: `npx truffle test test/CandidateDynamicHouseEdgeTests.js`
- Full suite: `npm test` (handles Ganache hardfork compatibility automatically)