'use client'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import Sider from "antd/es/layout/Sider";
import { Content, Header } from "antd/es/layout/layout";
import { useState, useMemo } from "react";
import {
  FolderOpenOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import Link from "next/link";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    return [
      {
        href: "/",
        title: <FolderOpenOutlined />,
      },
      ...parts.map((part) => {
        return {
          href: "",
          title: (
            part.charAt(0).toUpperCase() + part.slice(1)
          ),
        };
      }),
    ];
  }, [pathname]);
  const isMobile = !screen.width || screen.width < 768;
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Layout style={{ minHeight: '100vh', background: colorBgContainer, position: 'relative' }}>
          <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme="dark"
            style={{
              position: isMobile ? collapsed ? 'static' : 'absolute' : 'static',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: 1000, // ensure it's on top
            }}
            className='m-2 p-2 rounded-2xl overflow-hidden'>
            <div className="flex justify-between items-center w-full">
              {!collapsed && <span className="ml-8">CLOIT</span>}
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                  color: 'white',
                }}
              />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={['1']}
              items={[
                {
                  key: '1',
                  icon: <span className="text-gray-300">📁</span>,
                  label: <Link href="/systems/menu">Systems</Link>,
                },
                {
                  key: '3',
                  icon: <span className="text-gray-300">👥</span>,
                  label: <Link href="/users">Users & Group</Link>,
                },
                {
                  key: '4',
                  icon: <span className="text-gray-300">🏆</span>,
                  label: <Link href="/competitions">Competition</Link>,
                },
              ]}
            />
          </Sider>
          <Layout style={{ background: 'white' }}>
            <Header className="flex items-center h-16 mt-4" style={{ background: 'white' }}>
              <Breadcrumb items={breadcrumbItems} />
            </Header>
            <Content
              style={{
                paddingLeft: 24,
                paddingRight: 24,
                paddingBottom: 24,
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </body>
    </html>
  );
}
