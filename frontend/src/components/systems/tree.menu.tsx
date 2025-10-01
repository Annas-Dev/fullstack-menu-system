'use client';
import React, { ReactNode, useState } from 'react';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, message, Modal, Tree } from 'antd';
import type { TreeDataNode, TreeProps } from 'antd';
import { createMenu, getMenus } from '@/lib/api';
import { useMessage } from '../messages/messages';
const TreeMenu: React.FC<{
  expandAll: boolean;
  collapseAll: boolean;
  onSelect: (node: TreeDataNode | null) => void;
  treeData: TreeDataNode[];
  onCreateSuccess: () => void;   // 🔹 add this
}> = ({ expandAll, collapseAll, onSelect, treeData, onCreateSuccess }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [hoveredNode, setHoveredNode] = useState<TreeDataNode | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [treeDatas, setTreeDatas] = useState<TreeDataNode[]>([]);
  const [newMenu, setNewMenu] = useState({ name: '', parentId: null as number | null });
  const [newMenuName, setNewMenuName] = useState('');
  const { success, error } = useMessage();
  const [loading, setLoading] = useState(false);

  const onExpand: TreeProps['onExpand'] = (keys) => setExpandedKeys(keys);

  React.useEffect(() => {
    if (expandAll) {
      const allKeys: string[] = [];
      const collectKeys = (nodes: TreeDataNode[]) => {
        nodes.forEach((node) => {
          allKeys.push(node.key as string);
          if (node.children) collectKeys(node.children);
        });
      };
      collectKeys(treeData);
      setExpandedKeys(allKeys);
    }
  }, [expandAll, treeData]);

  React.useEffect(() => {
    if (collapseAll) setExpandedKeys([]);
  }, [collapseAll]);

  React.useEffect(() => {
    setTreeDatas(treeData);
  }, [treeData]);

  const handleCreate = async () => {
    setLoading(true);
    if (newMenuName && newMenu.parentId !== null) {
      try {
        await createMenu({ name: newMenuName, parentId: newMenu.parentId });
        setNewMenuName('');
        setNewMenu({ name: '', parentId: null });
        setIsModalVisible(false);
        success('Menu created successfully');
        onCreateSuccess();   // 🔹 tell parent to refresh
      } catch (errorr) {
        error('Failed to create menu');
      } finally {
        setLoading(false);
      }
    }
  };

  const renderTitle = (node: TreeDataNode): ReactNode => {
    if (typeof node.title === 'function') return node.title({ ...node });
    return node.title;
  };

  const onSelectt: TreeProps['onSelect'] = (selectedKeys, info) => {
    if (selectedKeys.length > 0 && info.node) onSelect(info.node);
    else onSelect(null);
  };

  return (
    <>
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        onExpand={onExpand}
        treeData={treeDatas}
        onMouseEnter={({ node }) => setHoveredNode(node)}
        onMouseLeave={() => setHoveredNode(null)}
        titleRender={(node) => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{renderTitle(node)}</span>
            {hoveredNode?.key === node.key && (
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => {
                  const key = node.key as string;
                  const parentId = Number(key.split('-')[1]);
                  setNewMenu({ name: '', parentId });
                  setIsModalVisible(true);
                }}
                style={{ marginLeft: '8px', padding: '0 4px' }}
              />
            )}
          </div>
        )}
        onSelect={onSelectt}
      />
      <Modal
        title="Add New Menu"
        open={isModalVisible}
        onOk={handleCreate}
        onCancel={() => setIsModalVisible(false)}
        okText="Create"
        footer={[
          <Button key="back" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleCreate}>
            Submit
          </Button>
        ]}
      >
        <Input
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          placeholder="Enter menu name"
          autoFocus
        />
      </Modal>
    </>
  );
};
export default TreeMenu;