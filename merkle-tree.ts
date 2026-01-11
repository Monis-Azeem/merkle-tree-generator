import {ethers, keccak256} from 'ethers'

type hexString = `0x${string}`

function calculateAddressHash(address: hexString): hexString{
    const paddedAddress = ethers.zeroPadValue(address, 32) //solidity never hash 20 bytes which addresses are usually of, it hashes 32 bytes which is standard word size in Ethereum
    const firstHash = keccak256(paddedAddress)
    const secondHash = keccak256(firstHash) //so leafs are usually hashed twice and internal node once. This is done to prevent second preimage attack added by OpenZepplin as a standard safety measure.
    return secondHash as `0x${string}`
    //this is done because
}

function calculatePairHash(hash1: hexString, hash2: hexString): hexString{
    const value = Buffer.from(hash1.slice(2), 'hex').compare(Buffer.from(hash2.slice(2), 'hex'))
    if(value === -1)
        return keccak256('0x'+hash1.slice(2)+hash2.slice(2)) as `0x${string}`
    
    return keccak256('0x'+hash2.slice(2)+hash1.slice(2)) as `0x${string}`
    
}

function calculateNewLevel(tempArr: Array<`0x${string}`>){ //TODO: add return type here
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

function createTree(arr: Array<`0x${string}`>){
    if(arr.length === 0)
        return

    let hashArr = arr.map((address) => calculateAddressHash(address))

    if(hashArr.length === 1)
        return hashArr

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

function generateProof(tree: Array<Array<`0x${string}`>>, hashIndex: number){
  

}

const arrayOfAddresses: Array<hexString> = ['0xd8da6bf26964af9d7eed9e03e53415d37aa96045','0xeee718c1e522ecb4b609265db7a83ab48ea0b06f','0x14536667cd30e52c0b458baaccb9fada7046e056', '0x14536667cd30e52c0b458baaccb9fada7046e045', '0x14536667cd30e52c0b458baaccb9fada7046e046', '0x14536667cd30e51c0b458baaccb9fada7046e046']

// const sorted = [...arrayOfAddresses].sort((a,b) => Buffer.from(a.slice(2), 'hex').compare(Buffer.from(b.slice(2), 'hex')))

const value = createTree(arrayOfAddresses)

console.log('Tree: ', value)