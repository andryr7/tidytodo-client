// import axios from "axios";
import { NodeModel } from "@minoru/react-dnd-treeview";
import { axiosApiInstance } from "@data/api/axiosInstance";
import { Folder, FolderWithContent } from "@customTypes/folder";

export async function createFolderAtRoot({ folderName }: { folderName: string }) {
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL+`/folder/create`, { name: folderName })
    .then(res => res.data)
}

export async function createFolder({ folderName, parentFolderId }: { folderName: string, parentFolderId?: string | number }): Promise<Folder> {
  const newFolder = {
    name: folderName,
    ...(parentFolderId && parentFolderId !== 'root' && {folderId: parentFolderId})
  };
  return axiosApiInstance
    .post(import.meta.env.VITE_SERVER_URL+`/folder/create`, newFolder)
    .then(res => res.data)
}

export async function getFolders(): Promise<NodeModel[]> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL+'/folder/all')
    .then(res => res.data)
}

export async function getFolderWithContent({ folderId }: { folderId: string | number }): Promise<FolderWithContent> {
  return axiosApiInstance
    .get(import.meta.env.VITE_SERVER_URL+`/folder/withcontent/${folderId}`)
    .then(res => res.data)
}

export async function updateFolder({ folderId, newParentFolderId, newFolderName }: { folderId: string | number, newParentFolderId?: string | number, newFolderName?: string}): Promise<Folder> {
  const updatedFolder = {
    ...(newParentFolderId !== undefined && {folderId: newParentFolderId}),
    ...(newFolderName !== undefined && {name: newFolderName}),
  };
  return axiosApiInstance
    .patch(import.meta.env.VITE_SERVER_URL+`/folder/update/${folderId}`, updatedFolder)
    .then(res => res.data)
}

export async function deleteFolder({ folderId }: { folderId: string | number }): Promise<Folder> {
  return axiosApiInstance
    .delete(import.meta.env.VITE_SERVER_URL+`/folder/delete/${folderId}`)
    .then(res => res.data)
}