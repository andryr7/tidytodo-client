import { NodeModel } from "@minoru/react-dnd-treeview";
import { rootNodeFolder } from "@data/rootNodeFolder";

//Defining a function that can build the array representing the folders bread crums
export function getBreadCrumbsData(folders: NodeModel[], currentFolderId: string | number): NodeModel[] {
  //If the selected folder is root, just fill the array with the root folder model
  if(currentFolderId === 'root') {
    return [rootNodeFolder]
  }

  const breadCrumbs = [];

  //If the selected folder is not root, fetch the previous folder and place it in the array
  getPreviousFolder(currentFolderId);

  //Recursive function that adds the parent folder to the breadcrumbs array and possibly calls itself after
  function getPreviousFolder(iteratedFolderId: string | number) {
    const iteratedFolder = folders.find(folder => folder.id === iteratedFolderId)!;
    breadCrumbs.unshift(iteratedFolder);
    if(iteratedFolder.parent !== 'root') {
      getPreviousFolder(iteratedFolder.parent)
    }
  }

  //Add the root folder model to the array
  breadCrumbs.unshift(rootNodeFolder);

  return breadCrumbs
}