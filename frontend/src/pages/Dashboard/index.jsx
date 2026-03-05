import React from 'react';
import { Card, Statistic, Row, Col } from 'antd';

const Dashboard = () => {
  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="商品总数" value={112} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="订单总量" value={93} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="今日销售额" value={112893} precision={2} prefix="￥" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }} title="欢迎使用">
        <p>欢迎使用商品后台管理系统，请从左侧菜单开始操作。</p>
      </Card>
    </div>
  );
};

export default Dashboard;
