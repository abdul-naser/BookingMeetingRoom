import { Response } from "express";

const clients: Response[] = [];

export function addClient(res: Response) {
  clients.push(res);
}

export function removeClient(res: Response) {
  const index = clients.indexOf(res);
  if (index !== -1) clients.splice(index, 1);
}

export function broadcast(event: string, payload: any) {
  const data = `event: ${event}\n` + 
               `data: ${JSON.stringify(payload)}\n\n`;

  clients.forEach(res => res.write(data));
}
