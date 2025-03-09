import { getToken } from "./localStorageService"

export const isBelongTo = (createdBy) => {
  const token = getToken();

  const payloadBase64 = token.split('.')[1]; 
  const payload = JSON.parse(atob(payloadBase64));
  const sub = payload.sub;
  return sub === createdBy;
}