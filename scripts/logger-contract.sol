// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LordLuluLog {
    struct Report {
        string topic;
        uint256 timestamp;
        string briefingHash;
        uint256 spentUsd;  // in cents, e.g. 17 = $0.17
    }

    Report[] public reports;
    address public agent;

    constructor() {
        agent = msg.sender;
    }

    function logReport(
        string memory topic,
        string memory briefingHash,
        uint256 spentUsd
    ) public {
        reports.push(Report(topic, block.timestamp, briefingHash, spentUsd));
    }

    function getReportCount() public view returns (uint256) {
        return reports.length;
    }
}
