import React, { createContext, useContext, useState } from 'react';
import { message } from 'antd';

const MessageContext = createContext<{
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
}>({
    success: () => { },
    error: () => { },
    warning: () => { },
});

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const success = (content: string) => {
        messageApi.open({
            type: 'success',
            content,
        });
    };

    const error = (content: string) => {
        messageApi.open({
            type: 'error',
            content,
        });
    };

    const warning = (content: string) => {
        messageApi.open({
            type: 'warning',
            content,
        });
    };

    return (
        <MessageContext.Provider value={{ success, error, warning }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => {
    const context = useContext(MessageContext);
    if (context === undefined) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};