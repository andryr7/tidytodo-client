import { NodeModel } from '@minoru/react-dnd-treeview';
import { rootNodeFolder } from '@data/rootNodeFolder';

export function getBreadCrumbsData(
  folders: NodeModel[],
  currentFolderId: string | number
): NodeModel[] {
  //If the current folder is root, simply return an array containing the root folder model
  if (currentFolderId === 'root') {
    return [rootNodeFolder];
  }

  //Initiating the loop
  const breadCrumbs = getPreviousFolder(currentFolderId);

  //Recursive function that finds the previous folder and adds it to a newly created array
  function getPreviousFolder(iteratedFolderId: string | number): NodeModel[] {
    //Finding the current folder based on its id
    const iteratedFolder = folders.find((folder) => folder.id === iteratedFolderId)!;
    //Creating a new array containing it
    const result = [iteratedFolder];
    //Add the previous folder until root folder is reached
    if (iteratedFolder.parent !== 'root') {
      return result.concat(getPreviousFolder(iteratedFolder.parent));
    }
    return result;
  }

  // Add the root folder model to the array
  return breadCrumbs.concat(rootNodeFolder).reverse();
}
