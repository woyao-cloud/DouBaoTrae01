import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Form, Input, Select, Modal, message, Popconfirm, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from '../../utils/request';

const ProductList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('新增商品');
  const [modalForm] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const fetchCategories = async () => {
    // Flatten category tree for select options or use TreeSelect
    // For simplicity, fetching flat list or processing tree
    const res = await axios.get('/categories');
    // Simple flatten function for demonstration if API returns tree
    const flatten = (list) => {
      let arr = [];
      list.forEach(item => {
        arr.push(item);
        if (item.children) {
          arr = arr.concat(flatten(item.children));
        }
      });
      return arr;
    };
    setCategories(flatten(res.data));
  };

  const fetchData = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get('/products', {
        params: {
          page: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          ...form.getFieldsValue()
        }
      });
      setData(res.data.list);
      setPagination({
        ...pagination,
        current: res.data.page,
        total: res.data.total
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  const handleTableChange = (pag) => {
    setPagination(pag);
    fetchData({ current: pag.current, pageSize: pag.pageSize });
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchData({ current: 1 });
  };

  const handleAdd = () => {
    setModalTitle('新增商品');
    setCurrentId(null);
    modalForm.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setModalTitle('编辑商品');
    setCurrentId(record.id);
    modalForm.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (record) => {
    try {
      const newStatus = record.status === 1 ? 0 : 1;
      await axios.patch(`/products/${record.id}/status`, { status: newStatus });
      message.success('状态更新成功');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await modalForm.validateFields();
      if (currentId) {
        await axios.put(`/products/${currentId}`, values);
        message.success('更新成功');
      } else {
        await axios.post('/products', values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    { title: '编码', dataIndex: 'product_code' },
    { title: '名称', dataIndex: 'name' },
    { title: '分类', dataIndex: ['category', 'name'] },
    { title: '价格', dataIndex: 'price' },
    { title: '库存', dataIndex: 'stock' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text) => text === 1 ? <span style={{ color: 'green' }}>上架</span> : <span style={{ color: 'red' }}>下架</span>
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" onClick={() => handleStatusChange(record)}>
            {record.status === 1 ? '下架' : '上架'}
          </Button>
          <Popconfirm title="确定删除吗?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item name="name">
          <Input placeholder="商品名称" />
        </Form.Item>
        <Form.Item name="product_code">
          <Input placeholder="商品编码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSearch}>搜索</Button>
          <Button onClick={() => { form.resetFields(); handleSearch(); }} style={{ marginLeft: 8 }}>重置</Button>
        </Form.Item>
      </Form>
      
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增商品</Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <Modal
        title={modalTitle}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="product_code" label="商品编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="分类" rules={[{ required: true }]}>
            <Select>
              {categories.map(c => (
                <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="price" label="售价" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="cost_price" label="成本价" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductList;
