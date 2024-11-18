export const CONTRACT_ADDRESSES = {
    chainA: {
        token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        bridge: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
    chainB: {
        token: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        bridge: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    },
};

export const RPC_URLS = {
    chainA: "http://127.0.0.1:8545",
    chainB: "http://127.0.0.1:8546",
};

export const ALIASES: Record<string, string> = {
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "Demo 1",
    "0x1234...": "Company ABC",
    "0x5678...": "Company XYZ",
};
