import { getToken, getUser } from "./localStorageService"

export const isBelongTo = (createdBy) => {
  const token = getToken();

  const payloadBase64 = token.split('.')[1]; 
  const payload = JSON.parse(atob(payloadBase64));
  const sub = payload.sub;
  return sub === createdBy;
}

export const isOwner = (createdBy) => {
  const user = getUser();
  return user.id === createdBy;
}