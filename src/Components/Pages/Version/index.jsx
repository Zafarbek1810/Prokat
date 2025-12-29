import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Col, Form, Input, Row, Typography, Space } from "antd";
import { toast } from "react-toastify";
import VersionProvider from "../../../Data/VersionProvider";
import { AndroidOutlined, AppleOutlined, LinkOutlined } from "@ant-design/icons";

const { Title } = Typography;

const VersionWrapper = styled.div`
  .version-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
    gap: 24px;
    margin-top: 24px;
  }

  .version-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 28px;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #f1f5f9;

      .platform-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: #ffffff;
      }

      .android-icon {
        background: linear-gradient(135deg, #3ddc84 0%, #2bb673 100%);
      }

      .ios-icon {
        background: linear-gradient(135deg, #000000 0%, #4a4a4a 100%);
      }

      .platform-title {
        flex: 1;
        h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1e293b;
        }
        p {
          margin: 4px 0 0 0;
          font-size: 14px;
          color: #64748b;
        }
      }
    }

    .store-url-section {
      margin-bottom: 20px;
      padding: 12px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .store-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 500;
        color: #64748b;
        margin-bottom: 8px;
      }

      .store-url {
        font-size: 13px;
        color: #3b82f6;
        word-break: break-all;
        display: flex;
        align-items: center;
        gap: 6px;

        a {
          color: #3b82f6;
          text-decoration: none;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    .form-section {
      .ant-form-item-label > label {
        font-weight: 500;
        color: #475569;
      }
    }
  }

  .breadcrumb {
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }
  }
`;

const Version = () => {
  const [androidForm] = Form.useForm();
  const [iosForm] = Form.useForm();
  const [androidLoading, setAndroidLoading] = useState(false);
  const [iosLoading, setIosLoading] = useState(false);
  const [androidData, setAndroidData] = useState(null);
  const [iosData, setIosData] = useState(null);

  const ANDROID_STORE_URL = "https://play.google.com/store/apps/details?id=com.SaparvayevSarvarbek.forrent";
  const IOS_STORE_URL = "https://apps.apple.com/uz/app/4rent/id6752257572";

  // useEffect(() => {
  //   fetchVersions();
  // }, []);

  const fetchVersions = async () => {
    try {
      const [androidRes, iosRes] = await Promise.all([
        VersionProvider.getVersionApp("android"),
        VersionProvider.getVersionApp("ios"),
      ]);

      const androidVersion = androidRes?.data;
      const iosVersion = iosRes?.data;

      setAndroidData(androidVersion);
      setIosData(iosVersion);

      if (androidVersion) {
        androidForm.setFieldsValue({
          min_required_version: androidVersion.min_required_version || "",
          latest_version: androidVersion.latest_version || "",
        });
      }

      if (iosVersion) {
        iosForm.setFieldsValue({
          min_required_version: iosVersion.min_required_version || "",
          latest_version: iosVersion.latest_version || "",
        });
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
      toast.error("Версии загрузить не удалось");
    }
  };

  const handleUpdateAndroid = async (values) => {
    setAndroidLoading(true);
    try {
      const body = {
        min_required_version: values.min_required_version,
        latest_version: values.latest_version,
        store_url: ANDROID_STORE_URL,
      };

      await VersionProvider.updateVersionApp("android", body);
      toast.success("Android версия успешно обновлена!");
      // fetchVersions();
    } catch (error) {
      console.error("Error updating Android version:", error);
      toast.error("Ошибка при обновлении версии Android");
    } finally {
      setAndroidLoading(false);
    }
  };

  const handleUpdateIOS = async (values) => {
    setIosLoading(true);
    try {
      const body = {
        min_required_version: values.min_required_version,
        latest_version: values.latest_version,
        store_url: IOS_STORE_URL,
      };

      await VersionProvider.updateVersionApp("ios", body);
      toast.success("iOS версия успешно обновлена!");
      // fetchVersions();
    } catch (error) {
      console.error("Error updating iOS version:", error);
      toast.error("Ошибка при обновлении версии iOS");
    } finally {
      setIosLoading(false);
    }
  };

  return (
    <VersionWrapper>
      <div className="breadcrumb">
        <h1>Управление версиями</h1>
      </div>
      <div className="separator-breadcrumb border-top" style={{ marginTop: "16px", marginBottom: "24px" }}></div>

      <div className="version-grid">
        {/* Android Card */}
        <div className="version-card">
          <div className="card-header">
            <div className="platform-icon android-icon">
              <AndroidOutlined />
            </div>
            <div className="platform-title">
              <h3>Android</h3>
              <p>Управление версией для Android платформы</p>
            </div>
          </div>

          <div className="store-url-section">
            <div className="store-label">
              <LinkOutlined />
              <span>Ссылка на Google Play Store</span>
            </div>
            <div className="store-url">
              <a href={ANDROID_STORE_URL} target="_blank" rel="noopener noreferrer">
                {ANDROID_STORE_URL}
              </a>
            </div>
          </div>

          <Form
            form={androidForm}
            layout="vertical"
            onFinish={handleUpdateAndroid}
            className="form-section"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Минимальная требуемая версия"
                  name="min_required_version"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите версию",
                    },
                    {
                      pattern: /^\d+\.\d+\.\d+$/,
                      message: "Формат версии: X.X.X (например: 1.0.0)",
                    },
                  ]}
                >
                  <Input placeholder="1.0.0" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Последняя версия"
                  name="latest_version"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите версию",
                    },
                    {
                      pattern: /^\d+\.\d+\.\d+$/,
                      message: "Формат версии: X.X.X (например: 1.0.34)",
                    },
                  ]}
                >
                  <Input placeholder="1.0.34" size="large" />
                </Form.Item>
              </Col>
            </Row>

            {androidData && (
              <div style={{ marginBottom: 16, padding: "12px", background: "#f0f9ff", borderRadius: "8px" }}>
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                    Текущая минимальная версия: <strong>{androidData.min_required_version || "Не установлена"}</strong>
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                    Текущая последняя версия: <strong>{androidData.latest_version || "Не установлена"}</strong>
                  </Typography.Text>
                </Space>
              </div>
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={androidLoading}
                block
                style={{ height: "42px" }}
              >
                Обновить версию Android
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* iOS Card */}
        <div className="version-card">
          <div className="card-header">
            <div className="platform-icon ios-icon">
              <AppleOutlined />
            </div>
            <div className="platform-title">
              <h3>iOS</h3>
              <p>Управление версией для iOS платформы</p>
            </div>
          </div>

          <div className="store-url-section">
            <div className="store-label">
              <LinkOutlined />
              <span>Ссылка на App Store</span>
            </div>
            <div className="store-url">
              <a href={IOS_STORE_URL} target="_blank" rel="noopener noreferrer">
                {IOS_STORE_URL}
              </a>
            </div>
          </div>

          <Form
            form={iosForm}
            layout="vertical"
            onFinish={handleUpdateIOS}
            className="form-section"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Минимальная требуемая версия"
                  name="min_required_version"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите версию",
                    },
                    {
                      pattern: /^\d+\.\d+\.\d+$/,
                      message: "Формат версии: X.X.X (например: 1.0.0)",
                    },
                  ]}
                >
                  <Input placeholder="1.0.0" size="large" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Последняя версия"
                  name="latest_version"
                  rules={[
                    {
                      required: true,
                      message: "Пожалуйста, введите версию",
                    },
                    {
                      pattern: /^\d+\.\d+\.\d+$/,
                      message: "Формат версии: X.X.X (например: 1.0.34)",
                    },
                  ]}
                >
                  <Input placeholder="1.0.34" size="large" />
                </Form.Item>
              </Col>
            </Row>

            {iosData && (
              <div style={{ marginBottom: 16, padding: "12px", background: "#f0f9ff", borderRadius: "8px" }}>
                <Space direction="vertical" size={4} style={{ width: "100%" }}>
                  <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                    Текущая минимальная версия: <strong>{iosData.min_required_version || "Не установлена"}</strong>
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                    Текущая последняя версия: <strong>{iosData.latest_version || "Не установлена"}</strong>
                  </Typography.Text>
                </Space>
              </div>
            )}

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={iosLoading}
                block
                style={{ height: "42px" }}
              >
                Обновить версию iOS
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </VersionWrapper>
  );
};

export default Version;