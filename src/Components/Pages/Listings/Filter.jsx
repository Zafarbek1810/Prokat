import { Button, Col, Form, Input, Radio, Row } from "antd";
import React from "react";
import runes from "runes2";

const FilterListings = ({ setFilters }) => {
  const [form] = Form.useForm();
  const handleInput = (values) => {
    console.log(values);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      name: "",
      surname: "",
      passportSeries: "",
      passportNumber: "",
      phone: "",
      address: "",
      homePhone: "",
      gender: "",
    });
  };
  return (
    <div>
      <Form
        name="basic"
        layout={"vertical"}
        wrapperCol={{
          span: 24,
        }}
        onFinish={handleInput}
        form={form}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              label="Имя"
              name="name"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input name="name" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Фамилия"
              name="surname"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input name="surname" onChange={handleChange} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Паспорт серии"
              name="passportSeries"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                max={2}
                maxLength={2}
                count={{
                  show: true,
                  max: 2,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                name="passportSeries"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Номер паспорта"
              name="passportNumber"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                max={7}
                maxLength={7}
                count={{
                  show: true,
                  max: 7,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                name="passportNumber"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Телефон"
              name="phone"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                addonBefore="+998"
                max={9}
                maxLength={9}
                count={{
                  show: true,
                  max: 7,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                name="phone"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Домашний телефон"
              name="homePhone"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input
                addonBefore="+998"
                max={9}
                maxLength={9}
                count={{
                  show: true,
                  max: 7,
                  strategy: (txt) => runes(txt).length,
                  exceedFormatter: (txt, { max }) =>
                    runes(txt).slice(0, max).join(""),
                }}
                name="homePhone"
                onChange={handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Адрес"
              name="address"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Input name="address" onChange={handleChange} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label="Пол"
              name="gender"
              rules={[
                {
                  required: false,
                },
              ]}
            >
              <Radio.Group
                options={[
                  {
                    label: "Мужской",
                    value: "MALE",
                  },
                  {
                    label: "Женщина",
                    value: "FEMALE",
                  },
                ]}
                onChange={handleChange}
                // value={value}
                optionType="button"
                name="gender"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ display: "flex", justifyContent: "end" }}>
          <Button
            htmlType="button"
            onClick={handleReset}
            style={{ marginRight: 20 }}
          >
            Очистить
          </Button>
          <Button type="primary" htmlType="submit">
            Фильтрация
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FilterListings;
