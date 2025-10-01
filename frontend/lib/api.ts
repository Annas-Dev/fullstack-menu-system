import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const getMenus = () => axios.get(`${API_BASE}/menus`);
export const createMenu = (data: { name: string, parentId?: number }) => axios.post(`${API_BASE}/menus`, data);
export const updateMenu = (id: number, data: { name: string }) => axios.put(`${API_BASE}/menus/${id}`, data);
export const deleteMenu = (id: number) => axios.delete(`${API_BASE}/menus/${id}`);
// export const saveMenu = (data: any) => axios.post(`${API_BASE}/menus/save`, data);