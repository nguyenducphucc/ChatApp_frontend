import axios from "axios";

const baseUrl = "/api/friends";

export const doFriendRequest = async (requestRelationship) => {
  const res = await axios.post(`${baseUrl}/add`, requestRelationship);
  return res.data;
};

export const cancelFriendRequest = async (requestRelationship) => {
  await axios.delete(`${baseUrl}/cancel`, { data: requestRelationship });
};

export const createFriendRelationship = async (requestRelationship) => {
  await axios.put(`${baseUrl}/create`, requestRelationship);
};
