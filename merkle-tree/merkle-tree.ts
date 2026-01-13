import {ethers, keccak256} from 'ethers'
import { Buffer } from 'buffer'

type hexString = `0x${string}`

export function calculateAddressHash(address: hexString): hexString{
    const paddedAddress = ethers.zeroPadValue(address, 32) //solidity never hash 20 bytes which addresses are usually of, it hashes 32 bytes which is standard word size in Ethereum
    const firstHash = keccak256(paddedAddress)
    const secondHash = keccak256(firstHash) //so leafs are usually hashed twice and internal node once. This is done to prevent second preimage attack added by OpenZepplin as a standard safety measure.
    return secondHash as `0x${string}`
}

function calculatePairHash(hash1: hexString, hash2: hexString): hexString{
    const value = Buffer.from(hash1.slice(2), 'hex').compare(Buffer.from(hash2.slice(2), 'hex'))
    if(value === -1)
        return keccak256('0x'+hash1.slice(2)+hash2.slice(2)) as `0x${string}`
    
    return keccak256('0x'+hash2.slice(2)+hash1.slice(2)) as `0x${string}`
    
}

function calculateNewLevel(tempArr: Array<`0x${string}`>){
    let arr = []

    for(let left=0; left<tempArr.length; left+=2){
        let right = left+1
        if(tempArr[right] === undefined){
          // arr.push(calculatePairHash(tempArr[left] as `0x${string}`, tempArr[left] as `0x${string}`)) //if we are duplicating the last leaf node. But it is known to be vulnerable to attack
          arr.push(tempArr[left])
          break;
        }
        const pairHash = calculatePairHash(tempArr[left] as `0x${string}`, tempArr[right] as `0x${string}`)
        arr.push(pairHash)
    }

    return arr
}

export function createTree(arr: Array<`0x${string}`>): Array<Array<`0x${string}`>>{
    if(arr.length === 0)
        return [[]]

    let hashArr = arr.map((address) => calculateAddressHash(address))

    if(hashArr.length === 1){
        const singleRoot = []
        singleRoot.push(hashArr)
        return singleRoot
    }

    let tree = []
    tree.push(hashArr)

    while(true){
        if(hashArr.length === 1){
            return tree
        }

        hashArr = calculateNewLevel(hashArr) as Array<hexString>
        tree.push(hashArr)
    }

}

//proof : Array of sibling hashes to prove that leaf belongs to the tree.
export function generateProof(tree: Array<Array<`0x${string}`>>, hashIndex: number): Array<`0x${string}`> {
    let proofArr = []
    if(hashIndex === 0 && tree.length === 1){
        //@ts-ignore
        proofArr.push(tree[0][hashIndex])
        return proofArr as Array<`0x${string}`>
    }

    let index = hashIndex % 2 === 0 ? hashIndex + 1 : hashIndex - 1
    //@ts-ignore
    const siblingLeaf = tree[0][index]
    proofArr.push(siblingLeaf)

        if(index === 0)
            return proofArr as Array<`0x${string}`>
 

        for(let i = 1; i<tree.length-1; i++){
            let positionAtEachLevel = Math.floor(index/2)
            index = positionAtEachLevel%2 === 0 ? positionAtEachLevel + 1 : positionAtEachLevel - 1
            //@ts-ignore
            proofArr.push(tree[i][index])
            // console.log('i: ', i ,'index: ',index ,'proof Arr at every step:', proofArr)

    }

    return proofArr.filter((item) => item !== undefined) as Array<`0x${string}`>  

}

export function verify(leaf: `0x${string}`, proofArray: Array<`0x${string}`>, root: `0x${string}`): boolean {
    //For one address, if there is one address only in tree, then leaf and root will be same
    if(leaf === root)
        return true 

    let calculateRoot = leaf
    proofArray.forEach((proofArrElement) => {
        calculateRoot = calculatePairHash(proofArrElement, calculateRoot)
    })
    if(root === calculateRoot)
        return true

    return false
}

// const addresses: Array<`0x${string}`> = [
//   '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
// //   '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
// //   '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
// //   '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e',
// //   '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
// //   '0x6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a',
// //   '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
// //   '0x8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
// //   '0x9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
// //   '0x0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e',
// //   '0x1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
// //   '0x2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
// ]

// can be sorted too according to openZepplin merkle library
// const sorted = [...arrayOfAddresses].sort((a,b) => Buffer.from(a.slice(2), 'hex').compare(Buffer.from(b.slice(2), 'hex')))

// const tree = createTree(addresses)

// console.log('Tree: ', tree)

// const proof = generateProof(tree, 0)
// console.log('Proof: ', proof)

// //@ts-ignore
// console.log('Exists: ', verify(calculateAddressHash(addresses[0] as `0x${string}`), proof, tree[tree.length-1][0]))
