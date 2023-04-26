# Demo contract deployment

## Pre-requisites

- [x] Asto Token Test (with free mint): 0x25720f1f60bd2F50C50841fF04d658da10BDf0B7
- [x] Compute Request Manager: 0xC8c50e5C235524677e667687dcB94268b97d8889
- [x] BRAIN_ADDRESS: 0x3181b617b374F1e0E1944d958D7Ab4886117a5Dc

see `.env.example`

## Contracts deployment and setup

### Challenge contract deployment

```sh
npx hardhat run hardhat_scripts/deployChallenge.ts --network porcini
```

- [x] Challenge deployed to: 0x640c2d84093E94a3c939556f0EB26FB52f7757A5

### Memory Tree deployment

```sh
npx hardhat run hardhat_scripts/deployMemoryTree.ts --network porcini
```

- [x] PongMemoryTree deployed to: 0x2E1a50936133470d75dA86B6E10CF95272C9ccE9

### Compute Manger deployment

```sh
npx hardhat run hardhat_scripts/deployComputeManager.ts --network porcini
```

- [x] PongComputeManager deployed to: 0xE784485ba9d16007f0944c4e23e76EE5842123B7

### Setting Signer

```sh
MT_ADDRESS=0x2E1a50936133470d75dA86B6E10CF95272C9ccE9 MT_SIGNER_ADDRESS=0x1Fb0E85b7Ba55F0384d0E06D81DF915aeb3baca3 npx hardhat run hardhat_scripts/updateMemoryTreeSigner.ts --network porcini
```

- [x] Signer set: 0x1Fb0E85b7Ba55F0384d0E06D81DF915aeb3baca3
