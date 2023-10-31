import { DocumentData } from "@customTypes/document";
import { axiosApiInstance } from "./axiosInstance";

export async function getSearchedDocuments({ searchInput }: { searchInput: string }): Promise<DocumentData> {
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL+'/document/search', { search: searchInput })
    .then(res => res.data)
}

export async function getFavoriteDocuments(): Promise<DocumentData> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL+'/document/favorite')
    .then(res => res.data)
}

export async function getArchivedDocuments(): Promise<DocumentData> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL+'/document/archived')
    .then(res => res.data)
}

export async function getLastUpdatedDocuments(): Promise<DocumentData> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL+'/document/lastupdated')
    .then(res => res.data)
}