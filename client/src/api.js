import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getCatalogs = () => axios.get(`${BASE_URL}/catalogs`);
export const addCatalog = (data) => axios.post(`${BASE_URL}/catalogs`, data);

export const getApisInCatalog = (catalogId) =>
  axios.get(`${BASE_URL}/catalogs/${catalogId}/apis`);
export const addApiToCatalog = (catalogId, data) =>
  axios.post(`${BASE_URL}/catalogs/${catalogId}/apis`, data);

export const getApiDetail = (apiId) =>
  axios.get(`${BASE_URL}/apis/${apiId}`);
export const testApi = (apiId, data) =>
  axios.post(`${BASE_URL}/apis/${apiId}/test`, data);

export const editApi = (apiId, data) =>
  axios.put(`${BASE_URL}/apis/${apiId}`, data);
export const deleteApi = (apiId) =>
  axios.delete(`${BASE_URL}/apis/${apiId}`);
export const editCatalog = (catalogId, data) =>
  axios.put(`${BASE_URL}/catalogs/${catalogId}`, data);
export const deleteCatalog = (catalogId) =>
  axios.delete(`${BASE_URL}/catalogs/${catalogId}`);
