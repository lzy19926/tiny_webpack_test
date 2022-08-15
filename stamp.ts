
type modal = {
    connId: string,
    atstrtackerIp: string,
    attackerPort: number,
    attackerMac: string,
    // victim_targeting
    targetIp: string,
    targetPort: string,
    targetMac: string,
    activeTime: string,
    category: string,
    type: string,
    command: string,
    payload: any,
    agentId: string,
    agentUuid: string,
    agentName: string,// user:string
    agentHostname:string, // host_name:string
    agentVersion:string,
    agentPlatfom:string,
    agentOs:string, // os
    agentAddr:string,

}