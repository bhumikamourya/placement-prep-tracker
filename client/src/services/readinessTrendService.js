import api from "./api";

export const getReadinessTrend = async () => {
  const res = await api.get("/readiness/trend");
  return res.data;
};
