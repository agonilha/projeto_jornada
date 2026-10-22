export type VehicleStatus = "Ativo" | "Inativo" | "Bloqueado";

export interface SupervisorDashboardData {
  usuario: {
    nome: string;
  };
  veiculo: {
    placa: string;
    status: VehicleStatus;
  };
  proximaCarga: {
    tipo: string;
    patio: string;
    doca: string;
  } | null;
  historico: {
    total: number;
    mes: number;
    hoje: number;
  };
  notificacoesNaoLidas: number;
}

const mockData: SupervisorDashboardData = {
  usuario: {
    nome: "José Carlos",
  },
  veiculo: {
    placa: "ABC-1D23",
    status: "Ativo",
  },
  proximaCarga: {
    tipo: "Expedição",
    patio: "Pátio 01",
    doca: "01",
  },
  historico: {
    total: 25,
    mes: 5,
    hoje: 3,
  },
  notificacoesNaoLidas: 2,
};

export async function getSupervisorDashboard(): Promise<SupervisorDashboardData> {
  // Simula o tempo de resposta de uma API.
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    ...mockData,
    usuario: { ...mockData.usuario },
    veiculo: { ...mockData.veiculo },
    proximaCarga: mockData.proximaCarga
      ? { ...mockData.proximaCarga }
      : null,
    historico: { ...mockData.historico },
  };
}