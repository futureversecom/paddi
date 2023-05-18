import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { PongMemoryTree__factory } from 'smart-contracts/typechain-types/factories/src/PongMemoryTree__factory'
import { abis } from 'src/utils/abis'

import { useSignerOrProvider } from './useSignerOrProvider'

export const useMemoryTreeContract = () => {
  const signerOrProvider = useSignerOrProvider()

  const contract = useMemo(() => {
    return PongMemoryTree__factory.connect(
      abis.PongMemoryTree.address,
      signerOrProvider,
    )
  }, [signerOrProvider])

  return contract
}

export type MemoryNode = {
  id: number
  children: number[]
  storageURI: string
}

export type MemoryTree = {
  rootNodeIds: number[]
  nodes: Record<number, MemoryNode>
}

export type MemoryTreesOfBrain = {
  memoryTrees: MemoryTree
  normalizeId: Record<number, number>
}

export const useMemoryTreesOfBrain = (brainId: number) => {
  const memoryTreeContract = useMemoryTreeContract()

  return useQuery(
    ['memoryTree', 'memoryTreesOfBrain', brainId],
    async (): Promise<MemoryTreesOfBrain> => {
      const treeIds = await memoryTreeContract.memoryTreesOfBrain(
        abis.MockBrain.address,
        brainId,
      )
      const allNodeIds: number[] = []

      const trees = await Promise.all(
        treeIds.map(async (treeId): Promise<MemoryTree> => {
          const tree = await memoryTreeContract.getMemoryTreeDetails(treeId)
          const [memoryNodeIds, memoryNodes] = await Promise.all([
            memoryTreeContract.memoryNodeIdsOfMemoryTree(treeId),
            memoryTreeContract.memoryNodesOfMemoryTree(treeId),
          ])

          const nodeEntries = memoryNodeIds.map(
            (memoryNodeId, i): [number, MemoryNode] => {
              const memoryNode = memoryNodes[i]

              if (!memoryNode) {
                throw new Error('memoryNode not found for memoryNodeId')
              }
              allNodeIds.push(memoryNodeId.toNumber())

              return [
                memoryNodeId.toNumber(),
                {
                  id: memoryNodeId.toNumber(),
                  children: memoryNode.children.map(child => child.toNumber()),
                  storageURI: memoryNode.storageURI,
                },
              ]
            },
          )

          return {
            rootNodeIds: tree.rootNodes.map(rootNode => rootNode.toNumber()),
            nodes: Object.fromEntries(nodeEntries),
          }
        }),
      )

      const normalizeId: Record<number, number> = {}
      allNodeIds
        .sort((a, b) => a - b)
        .forEach((nodeId, index) => {
          normalizeId[nodeId] = index + 1
        })

      // combine trees as root nodes are new trees anyway
      const memoryTrees = trees.reduce(
        (acc, tree): MemoryTree => ({
          rootNodeIds: [...acc.rootNodeIds, ...tree.rootNodeIds],
          nodes: {
            ...acc.nodes,
            ...tree.nodes,
          },
        }),
        { rootNodeIds: [], nodes: {} },
      )

      return {
        memoryTrees,
        normalizeId: normalizeId,
      }
    },
  )
}

export const useAddMemoryTree = (brainId: number) => {
  const queryClient = useQueryClient()
  const memoryTreeContract = useMemoryTreeContract()

  return useMutation(
    async ({
      nodeHash,
      storageURI,
      signature,
    }: {
      nodeHash: string
      storageURI: string
      signature: string
    }) => {
      const tx = await memoryTreeContract.addMemoryTree(
        abis.MockBrain.address,
        brainId,
        nodeHash,
        storageURI,
        signature,
      )
      return await tx.wait()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'memoryTree',
          'memoryTreesOfBrain',
          brainId,
        ])
      },
    },
  )
}

export const useAddNode = (brainId: number) => {
  const queryClient = useQueryClient()
  const memoryTreeContract = useMemoryTreeContract()

  return useMutation(
    async ({
      parentId,
      nodeHash,
      storageURI,
      signature,
    }: {
      parentId: string
      nodeHash: string
      storageURI: string
      signature: string
    }) => {
      const tx = await memoryTreeContract.addNode(
        parentId,
        nodeHash,
        storageURI,
        signature,
      )
      return await tx.wait()
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries([
          'memoryTree',
          'memoryTreesOfBrain',
          brainId,
        ])
      },
    },
  )
}
