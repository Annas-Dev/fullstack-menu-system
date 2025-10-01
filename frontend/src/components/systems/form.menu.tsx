import { updateMenu } from '@/lib/api';
import { Button, Input, message } from 'antd';
import type { TreeDataNode } from 'antd';
import { useState, useEffect } from 'react';
import { useMessage } from '../messages/messages';
interface CustomTreeDataNode extends TreeDataNode {
    depth?: number;
    parentId?: number;
}
const findNodeByKey = (nodes: TreeDataNode[], key: string): CustomTreeDataNode | undefined => {
    for (const node of nodes) {
        if (node.key === key) return node as CustomTreeDataNode;
        if (node.children) {
            const found = findNodeByKey(node.children, key);
            if (found) return found;
        }
    }
    return undefined;
};

const FormMenu: React.FC<{ selectedNode: CustomTreeDataNode | null; treeData: TreeDataNode[]; onSaveSuccess: () => void }> = ({ selectedNode, treeData, onSaveSuccess }) => {
    const [formData, setFormData] = useState({
        menuId: '',
        depth: '',
        parentName: '',
        name: '',
    });
    const { success, error } = useMessage();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (selectedNode) {
            const parentId = selectedNode.parentId;
            const parentKey = parentId !== null && parentId !== undefined ? `menu-${parentId}` : null;
            const parentNode = parentKey ? findNodeByKey(treeData, parentKey) : null;
            setFormData({
                menuId: (selectedNode.key as string).split('-')[1] || '',
                depth: selectedNode.depth?.toString() || '',
                parentName: parentNode ? (parentNode.title as string) || 'No Parent' : 'No Parent',
                name: typeof selectedNode.title === 'string' ? selectedNode.title : '',
            });
        } else {
            setFormData({ menuId: '', depth: '', parentName: '', name: '' });
        }
    }, [selectedNode, treeData]);

    const handleSave = async () => {
        setLoading(true);
        if (!selectedNode || !selectedNode.key) {
            error('Please select a node to save');
            return;
        }

        try {
            const key = selectedNode.key;
            if (typeof key !== 'string') {
                error('Invalid node key format');
                return;
            }
            const id = Number(key.split('-')[1]);
            await updateMenu(id, {
                name: formData.name
            });
            success('Menu updated successfully');
            if (onSaveSuccess) onSaveSuccess();
        } catch (errorr) {
            error('Failed to update menu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-4">
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">MenuID</label>
                        <Input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            value={formData.menuId}
                            size="large"
                            disabled
                        />
                    </div>
                    <div className="w-2/3">
                        <label className="block text-sm font-medium text-gray-500">Depth</label>
                        <Input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            value={formData.depth}
                            size="large"
                            disabled
                        />
                    </div>
                    <div className="w-2/3">
                        <label className="block text-sm font-medium text-gray-500">Parent Data</label>
                        <Input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            value={formData.parentName}
                            onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                            size="large"
                            disabled
                        />
                    </div>
                    <div className="w-2/3">
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <Input
                            type="text"
                            className="mt-1 block w-full border-gray-300 rounded-md"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            size="large"
                        />
                    </div>
                    <Button
                        type="primary"
                        htmlType="button"
                        className="w-2/3 bg-blue-900"
                        shape="round"
                        size="large"
                        onClick={handleSave}
                        loading={loading}
                    >
                        Save
                    </Button>
                </form>
            </div>
        </>

    );
};

export default FormMenu;