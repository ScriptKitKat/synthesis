// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleStorage
/// @notice Stores the latest Signal Scout report hash on-chain for verifiability
/// @dev Deployed on Base for the Status Network side quest
contract SimpleStorage {
    address public owner;
    string public latestReportHash;
    string public latestTopic;
    uint256 public lastUpdated;

    event ReportStored(
        address indexed agent,
        string topic,
        string reportHash,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Store a new report hash (IPFS CID or keccak256 of report content)
    /// @param topic The research topic
    /// @param reportHash The hash or CID of the report
    function storeReport(string calldata topic, string calldata reportHash) external onlyOwner {
        latestTopic = topic;
        latestReportHash = reportHash;
        lastUpdated = block.timestamp;

        emit ReportStored(msg.sender, topic, reportHash, block.timestamp);
    }

    /// @notice Get the latest stored report info
    function getLatestReport() external view returns (
        string memory topic,
        string memory reportHash,
        uint256 timestamp
    ) {
        return (latestTopic, latestReportHash, lastUpdated);
    }
}
