import { useEffect, useState, useCallback } from "react";
import Tree from "../models/tree";
import Node from "../models/node";
import NodeMap from '../models/types/nodeMap';
import NodeSelection from '../models/interface/nodeSelection';

const updateSelectedNodes = (prev: NodeMap, selected: NodeSelection): NodeMap => {
    const map = new Map(prev);
    if(selected.selected){
        map.set(selected.node.id, selected.node);
    } else {
        map.delete(selected.node.id)
    }
    return map;
  }

export interface IUseTreeApi {
    tree: Tree;
    selectedNode: Node;
    actions: {
        grow: Function;
        prune: Function;
        chop: Function;
        selectNodes: Function;
    }
}
export default function useTree (treeParam): IUseTreeApi {
    const [tree, setTree] = useState<Tree>(treeParam || new Tree());
    const [selectedNodes, setSelectedNodes] = useState<NodeMap>(new Map());
    const [selectedNode, setSelectedNode] = useState<Node>(tree.root);

    const grow = useCallback(function(data) {
        tree.grow(selectedNode.id, data);
        setTree(new Tree(tree));
    }, [selectedNode]);

    const prune = useCallback(function () {
        tree.prune(selectedNode.id);
        setTree(new Tree(tree));
        setSelectedNode(tree.root);
    }, [selectedNode]);

    const chop = useCallback(function () {
        tree.chop()
        setTree(new Tree(tree));
    }, [tree]);
    
    const selectNodes = useCallback(function (nodeSelection: NodeSelection) {
        setSelectedNodes(prev => updateSelectedNodes(prev, nodeSelection));
        nodeSelection.selected && setSelectedNode(nodeSelection.node)
    }, []);

    useEffect(()=>{
        // console.log(tree)
    }, [tree, selectedNodes])

    return {tree, selectedNode, actions: {grow, prune, chop, selectNodes}};
}