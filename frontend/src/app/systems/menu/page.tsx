'use client';
import { Button, Dropdown, Select } from 'antd';
import { DownOutlined, ProductFilled } from '@ant-design/icons';
import TreeMenu from '@/components/systems/tree.menu';
import FormMenu from '@/components/systems/form.menu';
import { useState, useEffect } from 'react';
import type { TreeDataNode } from 'antd';
import { getMenus } from '@/lib/api';
import { MessageProvider } from '@/components/messages/messages';
interface CustomTreeDataNode extends TreeDataNode {
    depth?: number;
    parentId?: number | null;
}
const MenuPage = () => {
    const [expandAll, setExpandAll] = useState(false);
    const [collapseAll, setCollapseAll] = useState(false);
    const [selectedNode, setSelectedNode] = useState<TreeDataNode | null>(null);
    const [treeData, setTreeData] = useState<TreeDataNode[]>([]);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filteredTreeData, setFilteredTreeData] = useState<CustomTreeDataNode[]>([]);
    const [selectedRootKey, setSelectedRootKey] = useState<string | null>(null);
    useEffect(() => {
        fetchMenus();
    }, []);

    const fetchMenus = async () => {
        try {
            const response = await getMenus();
            const newTreeData = response.data as CustomTreeDataNode[];
            setTreeData(newTreeData);
            setRefreshKey(prev => prev + 1);
            setSelectedRootKey(null);
            setFilteredTreeData([]);
        } catch (error) {
            console.error('Failed to fetch menus:', error);
        }
    };

    const filterTreeByRoot = (rootKey: string) => {
        const findSubtree = (nodes: CustomTreeDataNode[], targetKey: string): CustomTreeDataNode[] => {
            for (const node of nodes) {
                if (node.key === targetKey) {
                    return [node];
                }
                if (node.children) {
                    const subtree = findSubtree(node.children, targetKey);
                    if (subtree.length > 0) {
                        return [node];
                    }
                }
            }
            return [];
        };

        const rootNode = treeData.find((node) => node.key === rootKey);
        if (rootNode) {
            setFilteredTreeData([rootNode]);
        } else {
            setFilteredTreeData([]);
        }
    };
    const handleExpandAll = () => {
        setExpandAll(true);
        setCollapseAll(false);
    };

    const handleCollapseAll = () => {
        setCollapseAll(true);
        setExpandAll(false);
    };

    const getLevel1Items = (data: CustomTreeDataNode[]): { label: string; value: string }[] => {
        return data
            .filter((node) => node.depth === 0)
            .map((node) => ({
                label: node.title as string,
                value: node.key as string,
            }));
    };

    const items = getLevel1Items(treeData);

    const handleSaveSuccess = () => {
        fetchMenus();
    };
    const handleChange = (value: string) => {
        setSelectedRootKey(value);
        filterTreeByRoot(value);
    };
    return (
        <>
            <MessageProvider>
                <div className="p-4">
                    <h2 className="text-xl font-extrabold mb-4 flex items-center">
                        <span className="w-8 h-8 bg-blue-700 rounded-full mr-2 grid place-items-center">
                            <ProductFilled style={{ color: 'white', fontSize: '14px' }} />
                        </span>
                        Menus
                    </h2>
                    <div className="w-full lg:w-1/3 mb-4">
                        <Select
                            className="w-full"
                            options={items}
                            onChange={handleChange}
                            value={selectedRootKey}
                            placeholder="Select a menu"
                        />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-8 h-full">
                    {/* Tree Section */}
                    <div className="w-full lg:w-2/4 pl-4 pr-4 pb-4">
                        <div className="flex flex-row gap-2 mb-4">
                            <Button
                                color="default"
                                variant={expandAll ? 'solid' : 'outlined'}
                                shape="round"
                                onClick={handleExpandAll}
                            >
                                Expand All
                            </Button>
                            <Button
                                color="default"
                                variant={collapseAll ? 'solid' : 'outlined'}
                                shape="round"
                                onClick={handleCollapseAll}
                            >
                                Collapse All
                            </Button>
                        </div>
                        <TreeMenu
                            key={refreshKey}
                            expandAll={expandAll}
                            collapseAll={collapseAll}
                            onSelect={setSelectedNode}
                            treeData={selectedRootKey ? filteredTreeData : treeData}
                            onCreateSuccess={handleSaveSuccess}   // 🔹 parent refresh
                        />

                    </div>
                    {/* Form Section */}
                    <div className="w-full lg:w-2/4">
                        <FormMenu
                            selectedNode={selectedNode}
                            treeData={treeData}
                            onSaveSuccess={handleSaveSuccess}
                        />
                    </div>
                </div>
            </MessageProvider>
        </>
    );
};

export default MenuPage;