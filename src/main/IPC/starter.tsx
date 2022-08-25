import { IPCStarter } from "./01-ipcStart";

export async function startIPC(mainWindow: any) {
  const IPCClass = new IPCStarter(mainWindow)
  Object.keys(IPCClass.mappingObject).forEach(functionName => {
    IPCClass.setRelevantFunction(functionName as any)
    IPCClass.relevantFunction()
  });

}
