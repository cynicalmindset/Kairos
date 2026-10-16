import React, { useState, useEffect } from "react";
import { Box, Text } from "ink";
import si from "systeminformation";
// import { promise } from "better-auth";

type cpudata = {
    load: number;
    cores: number[];
    model: string;
    speed: string;
}

type processinfo = {
  pid: number,
  name: string,
  cpu: number,
  mem: number,
  memoryMB: number
}

type memdata = {
    used: string;
    total: string;
    percent: number;
}

type netdata = {
    rx: string;
    tx: string;
}

// type uptime = {
//     time:number;
//     timeformatted:string;
// }

export function health(){
    
}

export function Load({ terminalWidth = 80 }: { terminalWidth?: number }) {
    const [cpu, setcpu] = useState<cpudata | null>(null);
    const [mem, setmem] = useState<memdata | null>(null);
    const [net, setnet] = useState<netdata | null>(null);
    const [processes, setProcesses] = useState<processinfo[]>([]);
    const [temperature, setTemperature] = useState<number | null>(null);;
    const [uptime, setuptime] = useState<string>("");
    const previousNet = React.useRef<{
      time: number;
      rx: number;
      tx: number;
    } | null>(null);
    // const [error, setError] = useState<string>("");
    // const [lastupdate, setlastupdate] = useState<string>("rendering...")

    const renderBar = (percent: number, width: number = 20) => {
        const filledCount = Math.max(0, Math.min(width, Math.round((percent / 100) * width)));
        const emptyCount = width - filledCount;
        const filled = "█".repeat(filledCount);
        const empty = "░".repeat(emptyCount);
        const color = percent > 80 ? "red" : percent > 60 ? "yellow" : "green";
        return (
            <Text>
                [<Text color={color}>{filled}</Text>
                <Text color="gray">{empty}</Text>] <Text color={color} bold>{Math.round(percent)}%</Text>
            </Text>
        );
    };

    const formatSpeed = (bytesPerSec: number) => {
        if (bytesPerSec > 1024 * 1024) {
            return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
        }
        return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    };

    const formatBytes = (bytes: number) => {
        if (bytes > 1024 * 1024 * 1024 * 1024) {
            return `${(bytes / (1024 ** 4)).toFixed(2)} TB`;
        }
        if (bytes > 1024 * 1024 * 1024) {
            return `${(bytes / (1024 ** 3)).toFixed(2)} GB`;
        }
        if (bytes > 1024 * 1024) {
            return `${(bytes / (1024 ** 2)).toFixed(2)} MB`;
        }
        return `${(bytes / 1024).toFixed(1)} KB`;
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    useEffect(() => {
        let mounted = true;
        const fetch = async () => {
            try {
                const [loadData, cpuInfo, memData, netData, timeData,temp,processdata] = await Promise.all([
                    si.currentLoad(),
                    si.cpu(),
                    si.mem(),
                    si.networkStats(),
                    si.time(),
                    si.cpuTemperature(),
                    si.processes(),                    
                ]);

            if(!mounted) return;  

            //netowork montoring
            const current = netData[0] ?? { rx_bytes: 0, tx_bytes: 0 };
            const now = Date.now();
            const previous = previousNet.current;

            if (previous) {
              const seconds = (now - previous.time) / 1000;

              const rxSpeed = Math.max(0, current.rx_bytes - previous.rx) / (seconds || 1);
              const txSpeed = Math.max(0, current.tx_bytes - previous.tx) / (seconds || 1);

              setnet({
                rx: formatSpeed(rxSpeed),
                tx: formatSpeed(txSpeed),
              });
            }


            previousNet.current = {
              rx: current.rx_bytes,
              tx: current.tx_bytes,
              time: now,
            };

            //temperature 
            if (temp.main !== null && temp.main !== undefined) {
              setTemperature(temp.main);
            } else {
              setTemperature(null);
            }


            //process monitoring
            const topP = processdata.list
                .map((p)=>({
                  pid:p.pid,
                  name:p.name,
                  cpu:p.cpu,
                  mem:p.mem,
                  memoryMB:p.memRss / (1024 * 1024)
                }))
                .sort((a,b)=>b.memoryMB - a.memoryMB)
                .slice(0,8);

            setProcesses(topP)

          

            //CPU monitoring nigga
            setcpu({
                load: loadData.currentLoad,
                cores: loadData.cpus.map((c)=>c.load),
                model: cpuInfo.brand,
                speed: `${cpuInfo.speed} GHz`
            });

            //Memmory monitoring nigga
            const totalGib = (memData.total / 1024 ** 3).toFixed(1);
            const usedGib = (memData.used / 1024 ** 3).toFixed(1);

            setmem({
                used: totalGib,
                total: usedGib,
                percent: (memData.used / memData.total) * 100,
            })

            //uptime monitoring
            const upSec = timeData.uptime;
            const days = Math.floor(upSec / 86400);
            const hours = Math.floor((upSec % 86400) / 3600);
            const mins = Math.floor((upSec % 3600) / 60);
            setuptime(`${days > 0 ? `${days}d ` : ""}${hours}h ${mins}m`);

            


            } catch (error) {
                console.log(error);
                // setError(error.message)
            }
        }

        fetch();
        const interval = setInterval(fetch,1000);

        return () => {
            mounted = false;
            clearInterval(interval)
        }
    },[])

     return (
    <Box flexDirection="column" paddingX={1} width="100%">


      {/* CPU Box */}
      <Box borderStyle="round" borderColor="gray" flexDirection="column" paddingX={1}>
        <Box justifyContent="space-between">
          <Text bold color="white">
            CPU • {cpu?.model || "Detecting..."}
          </Text>
          <Text color="gray">{cpu?.speed}</Text>
          <Text color={
            temperature === null ? "gray" :
            temperature >= 85 ? "red" :
            temperature >= 70 ? "yellow" : "green"
          }>
            {temperature !== null
              ? `🌡 ${temperature.toFixed(1)}°C`
              : "Temp: N/A"}
          </Text>
                  </Box>
        <Box marginTop={1} flexDirection="row" gap={2}>
          <Text color="white" bold>Total Usage:</Text>
          {cpu && renderBar(cpu.load, 24)}
        </Box>
        {cpu && (
          <Box marginTop={1} flexDirection="row" flexWrap="wrap" gap={2}>
            {cpu.cores.slice(0, 8).map((coreLoad, i) => (
              <Text key={i} color="gray">
                C{i}: <Text color={coreLoad > 75 ? "red" : "white"}>{Math.round(coreLoad)}%</Text>
              </Text>
            ))}
          </Box>
        )}
      </Box>


      {/* Memory Box */}
      <Box borderStyle="round" borderColor="gray" flexDirection="column" paddingX={1} marginTop={1}>
        <Text bold color="white">MEMORY (RAM)</Text>
        <Box marginTop={1} flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row" gap={2}>
            <Text color="white" bold>RAM Used:</Text>
            {mem && renderBar(mem.percent, 24)}
          </Box>
          <Text color="gray">
            {mem ? `${mem.used} / ${mem.total} GiB` : "..."}
          </Text>
        </Box>
      </Box>


      {/* Network Box */}
      <Box borderStyle="round" borderColor="gray" flexDirection="column" paddingX={1} marginTop={1}>
        <Text bold color="white">NETWORK BANDWIDTH</Text>
        <Box marginTop={1} flexDirection="row" justifyContent="space-around">
          <Text>
            <Text color="green" bold>▼ Download (RX): </Text>
            <Text color="white">{net?.rx || "0.0 KB/s"}</Text>
          </Text>
          <Text color="gray">│</Text>
          <Text>
            <Text color="blue" bold>▲ Upload (TX): </Text>
            <Text color="white">{net?.tx || "0.0 KB/s"}</Text>
          </Text>
        </Box>
      </Box>

      {/* Process by usage */}
<Box
  borderStyle="round"
  borderColor="gray"
  flexDirection="column"
  paddingX={1}
  marginTop={1}
>
  <Text bold color="white">
    TOP PROCESSES • MEMORY USAGE
  </Text>

  <Box justifyContent="space-between">
    <Text color="gray">PID   PROCESS</Text>
    <Text color="gray">CPU %   RAM MB</Text>
  </Box>

  {processes.map((p) => (
    <Box key={p.pid} justifyContent="space-between">
      <Text>
        <Text color="cyan">{String(p.pid).padEnd(6)}</Text>
        {p.name.slice(0, 22)}
      </Text>

      <Text>
        <Text color={p.cpu > 50 ? "red" : "white"}>
          {p.cpu.toFixed(1).padStart(5)}%
        </Text>
        {"   "}
        <Text color={p.memoryMB > 500 ? "red" : "yellow"}>
          {p.memoryMB.toFixed(0).padStart(6)}
        </Text>
      </Text>
    </Box>
  ))}
</Box>


      {/* Footer Info */}
      <Box marginTop={1} justifyContent="space-between">
        <Text color="gray">
          Uptime: <Text color="white">{uptime}</Text>
        </Text>
        <Text color="gray">Press <Text color="white" bold>[Esc]</Text> to exit</Text>
      </Box>
    </Box>
  );
}
