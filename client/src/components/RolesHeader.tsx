import { Row, Col, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';


export default function Header() {
    return (
        <Row>
            <Col span={12} style={{ textAlign: "left" }}>
                <h1 style={{ fontWeight: 700 }}>Create Your Desired Learning Journey</h1>
            </Col>
            <Col span={12} style={{ textAlign: "right" }}>
                <Button type="default" icon={<UserOutlined />} style={{ color: "black", fontSize:16, fontWeight: 600, borderRadius: 10, background: "#DBDBDB"}}>Eric</Button>
            </Col>
        </Row>

    )
}